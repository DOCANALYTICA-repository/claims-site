import User from '../models/userModel.js';
import Form from '../models/formModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc   Create a new form
// @route  POST /api/forms
// @access Private
export const createForm = async (req, res) => {
  try {
    const { formType, formData } = req.body;
    if (!formType || !formData) { throw new Error('Please include all form fields'); }

    let newFormObject = {
      formType,
      formData,
      submittedBy: req.user._id,
      status: 'Pending',
      approvalChain: [],
    };

    if (formType === 'Blue') {
      const teacherNames = formData.subjects.map((s) => s.teacherName);
      // THE FIX #1: Find unique teachers to prevent duplicate tasks
      const uniqueTeacherNames = [...new Set(teacherNames)]; 
      const teachers = await User.find({ name: { $in: uniqueTeacherNames }, role: 'Faculty/Staff' });
      const finalApprover = await User.findOne({ designation: 'HOD' });

      let chain = [];
      chain.push({ approverId: null, status: 'Pending', details: `Parent (${formData.parentEmail})` });
      
      teachers.forEach(teacher => {
        chain.push({ approverId: teacher._id, status: 'Pending' });
      });

      if (finalApprover) {
        chain.push({ approverId: finalApprover._id, status: 'Pending' });
      }

      newFormObject.approvalChain = chain;
      newFormObject.status = 'Pending Parent Approval';
    }

    const form = await Form.create(newFormObject);

    if (form && form.formType === 'Blue') {
      const approvalUrl = `http://localhost:5001/api/forms/${form._id}/parent-approve`;
      const message = `A new leave request has been submitted. Please approve it by clicking this link: ${approvalUrl}`;
      await sendEmail({
        email: formData.parentEmail,
        subject: 'Leave Request Approval Required',
        message,
      });
    }
    
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get user forms
// @route  GET /api/forms
// @access Private
export const getUserForms = async (req, res) => {
  try {
    const forms = await Form.find({ submittedBy: req.user._id });
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all forms
// @route  GET /api/forms/all
// @access Private/HOD
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({}).populate('submittedBy', 'name email');
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update form status
// @route  PUT /api/forms/:id/status
// @access Private/HOD
export const updateFormStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const form = await Form.findById(req.params.id);

    if (!form) {
      res.status(404);
      throw new Error('Form not found');
    }

    form.status = status;
    const updatedForm = await form.save();

    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Parent approves a form
// @route  GET /api/forms/:formId/parent-approve
// @access Public
export const parentApprove = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form) {
      return res.status(404).send('<h1>Form not found.</h1>');
    }

    const parentStep = form.approvalChain.find(step => step.details && step.details.startsWith('Parent'));

    if (parentStep && parentStep.status === 'Pending') {
        parentStep.status = 'Approved';
        parentStep.approvedAt = Date.now();
        form.status = 'Pending Teacher Approval';
        await form.save();
        res.send('<h1>Thank you. The leave request has been approved and forwarded.</h1>');
    } else {
        res.status(400).send('<h1>This approval link is invalid or has already been used.</h1>');
    }
  } catch (error) {
    res.status(500).send('<h1>An error occurred.</h1>');
  }
};

// @desc   Get forms for teacher approval
// @route  GET /api/forms/approvals/teacher
// @access Private/Faculty
export const getFormsForTeacherApproval = async (req, res) => {
  try {
    const forms = await Form.find({
      status: 'Pending Teacher Approval',
      approvalChain: {
        $elemMatch: {
          approverId: req.user._id,
          status: 'Pending',
        },
      },
    }).populate('submittedBy', 'name email');

    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Teacher approves/rejects their part of a form
// @route  PUT /api/forms/:formId/teacher-approve
// @access Private/Faculty
export const teacherApproveForm = async (req, res) => {
  try {
    const { status } = req.body;
    const form = await Form.findById(req.params.formId);

    if (!form) {
      res.status(404);
      throw new Error('Form not found');
    }

    let approvalFound = false;
    // THE FIX #2: Update ALL pending steps for this user, not just the first one
    form.approvalChain.forEach(step => {
      if (step.approverId && step.approverId.equals(req.user._id) && step.status === 'Pending') {
        step.status = status;
        step.approvedAt = Date.now();
        approvalFound = true;
      }
    });

    if (!approvalFound) {
      res.status(400);
      throw new Error('No pending approval found for this user');
    }

    // Check if all teachers have now approved
    const allTeacherSteps = form.approvalChain.filter(
      step => step.approverId && !step.details // Filter out parent and final approver
    );
    const allTeachersApproved = allTeacherSteps.every(
      step => step.status === 'Approved'
    );
    
    if (allTeachersApproved) {
        form.status = 'Pending Director Approval';
    }

    const updatedForm = await form.save();
    res.status(200).json(updatedForm);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};