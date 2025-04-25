import express from 'express';
import {
  getDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
} from '../controllers/dogController';

const router = express.Router();

router.route('/')
  .get(getDogs)
  .post(createDog);

router.route('/:id')
  .get(getDogById)
  .put(updateDog)
  .delete(deleteDog);

export default router; 