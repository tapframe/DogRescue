import express from 'express';
import {
  getDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
  getDogsFromRescue
} from '../controllers/dogController';

const router = express.Router();

router.route('/')
  .get(getDogs)
  .post(createDog);

router.route('/from-rescue')
  .get(getDogsFromRescue);

router.route('/:id')
  .get(getDogById)
  .put(updateDog)
  .delete(deleteDog);

export default router; 