import FeeReceipt from "../models/stdFeeReceipt.js";
import Student from "../models/student.js";


export const getStudentByGrNo = async (req, res) => {
  try {
    const { grno , schoolId} = req.params;
    const student = await Student.findOne({ grno: Number(grno) , schoolId });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const createFeeReceipt = async (req, res) => {
  try {
    const data = req.body;
    const isReceiptExist = await FeeReceipt.findOne({schoolId:req.body.schoolId,studentId:req.body.studentId , month : req.body.month , year : req.body.year})
    const receipt = new FeeReceipt(data);
    await receipt.save();
    res.status(201).json({ message: 'Receipt saved', receipt });
  } catch (err) {
    res.status(500).json({ message: 'Error saving receipt', error: err });
  }
};

export const getReceiptForPrint = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await FeeReceipt.findById(id);
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
