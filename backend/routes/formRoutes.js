import express from 'express';
import { 
  createForm, 
  getUserForms, 
  getAllForms, 
  updateFormStatus, 
  parentApprove, 
  getFormsForTeacherApproval,
  teacherApproveForm
} from '../controllers/formController.js';
import { protect, hod } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createForm);
router.get('/', protect, getUserForms);
router.get('/all', protect, hod, getAllForms);
router.put('/:id/status', protect, hod, updateFormStatus);
router.get('/:formId/parent-approve', parentApprove);
router.get('/approvals/teacher', protect, getFormsForTeacherApproval);
router.put('/:formId/teacher-approve', protect, teacherApproveForm);

export default router;