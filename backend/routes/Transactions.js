import express from 'express';
import { addTransactionController, deleteTransactionController, getAllTransactionController, updateTransactionController } from '../controllers/transactionController.js';
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router();

 router.use(requireAuth)

router.route("/addTransaction").post(addTransactionController);

router.route("/getTransaction").post(getAllTransactionController);

router.route("/deleteTransaction/:id").post(deleteTransactionController);

router.route('/updateTransaction/:id').put(updateTransactionController);

export default router;