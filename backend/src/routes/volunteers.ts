import express from 'express';
import {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  updateVolunteerStatus,
} from '../controllers/volunteerController';

const router = express.Router();

router.route('/')
  .get(getVolunteers)
  .post(createVolunteer);

router.route('/:id')
  .get(getVolunteer)
  .put(updateVolunteer)
  .delete(deleteVolunteer);

router.route('/:id/status')
  .patch(updateVolunteerStatus);

export default router; 