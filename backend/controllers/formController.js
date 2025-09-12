import User from '../models/userModel.js';
import Form from '../models/formModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc   Create a new form
// @route  POST /api/forms
// @access Private
export const createForm = async (req, res) => {
  try {
    console.log('--- CREATE FORM REQUEST RECEIVED ---');
    console.log('Request Body (req.body):', JSON.stringify(req.body, null, 2));
    const { formType, formData } = req.body;
    if (!formType || !formData) { throw new Error('Please include all form fields'); }

    const prefix = formType.substring(0, 2).toUpperCase(); // BL, YE, PI
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const applicationNumber = `${prefix}-${timestamp}`;

    let newFormObject = {
      applicationNumber,
      formType,
      formData,
      submittedBy: req.user._id,
      status: 'Pending',
      approvalChain: [],
    };

    if (formType === 'Blue') {
      const teacherNames = formData.subjects.map((s) => s.teacherName);
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
    const { status, reason } = req.body; // Expects 'status' and optional 'reason'
    const form = await Form.findById(req.params.formId);

    if (!form) {
      res.status(404);
      throw new Error('Form not found');
    }

    const approvalStep = form.approvalChain.find(
      (step) => step.approverId && step.approverId.equals(req.user._id)
    );

    if (!approvalStep || approvalStep.status !== 'Pending') {
      res.status(400);
      throw new Error('No pending approval found for this user');
    }

    // Update the teacher's step in the chain
    approvalStep.status = status;
    approvalStep.approvedAt = Date.now();

    if (status === 'Rejected') {
      form.status = 'Rejected - Resubmit';
      form.rejectionReason = reason; // Save the rejection reason to the main form document
    } else {
      // Check if all teachers have now approved to move to the next stage
      const allTeacherSteps = form.approvalChain.filter(
        (step) => step.approverId && !step.details
      );
      const allTeachersApproved = allTeacherSteps.every(
        (step) => step.status === 'Approved'
      );
      
      if (allTeachersApproved) {
          form.status = 'Pending Director Approval';
      }
    }

    const updatedForm = await form.save();
    res.status(200).json(updatedForm);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get a single form by ID
// @route  GET /api/forms/:id
// @access Private
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('submittedBy', 'name email');

    if (!form) {
      res.status(404);
      throw new Error('Form not found');
    }

    if (form.submittedBy._id.toString() !== req.user._id.toString() && req.user.role !== 'Faculty/Staff') {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};