import express from 'express';
import { getStudentByGrNo ,createFeeReceipt , getReceiptForPrint} from '../controller/stdFeeReceipt.js';


const router = express.Router();

router.get('/student/:grno/:schoolId', getStudentByGrNo);
router.post('/receipt', createFeeReceipt);
router.get('/receipt/:id', getReceiptForPrint);

export default router;
