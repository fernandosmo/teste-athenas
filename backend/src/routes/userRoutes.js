import express from 'express';
import {
  createUsersHandler,
  getUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/create', createUsersHandler);
router.get('/get-all', getUsersHandler);
router.get('/get-once/:id', getUserByIdHandler);
router.put('/update/:id', updateUserHandler);
router.delete('/delete/:id', deleteUserHandler);

export default router;
