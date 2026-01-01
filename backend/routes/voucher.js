import express from 'express';
import getSingleVoucher, {deleteVouchersByClass, deleteVoucherById,editVoucher,getStudentVoucher, generateVouchers,generateSingleVoucher,getVouchersByClass} from '../controller/voucher.js';
const router = express.Router();

// Define voucher-related routes here 
router.post('/generate',generateVouchers)
router.post('/generate-single',generateSingleVoucher)
router.get('/by-class',getVouchersByClass)  
router.post('/single',getSingleVoucher)
router.delete('/delete',deleteVouchersByClass)
router.delete('/delete/:voucherId', deleteVoucherById)
router.get('/getOne/:studentName/:fatherName' , getStudentVoucher)
router.put('/update/:voucherId',editVoucher)
export default router;