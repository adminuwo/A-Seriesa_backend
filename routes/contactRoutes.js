import express from 'express';
import {
  submitContact,
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
} from '../controllers/contactController.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

// Public routes
router.post('/submit', submitContact);

// Protected routes (Admin only)
router.get('/submissions', verifyToken, getAllSubmissions);
router.get('/submissions/:id', verifyToken, getSubmissionById);
router.patch('/submissions/:id/status', verifyToken, updateSubmissionStatus);
router.delete('/submissions/:id', verifyToken, deleteSubmission);

export default router;
