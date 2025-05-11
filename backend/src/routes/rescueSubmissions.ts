import express from 'express';
import {
  getRescueSubmissions,
  getRescueSubmission,
  createRescueSubmission,
  updateRescueSubmission,
  deleteRescueSubmission
} from '../controllers/rescueSubmissions';

const router = express.Router();

router
  .route('/')
  .get(getRescueSubmissions)
  .post(createRescueSubmission);

router
  .route('/:id')
  .get(getRescueSubmission)
  .put(updateRescueSubmission)
  .delete(deleteRescueSubmission);

export default router; 