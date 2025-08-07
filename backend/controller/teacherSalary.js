import TeacherSalary from '../models/teachersalary.js';

// Add a new teacher salary
export const addTeacherSalary = async (req, res) => {
  try {
    const {
      teacherId,
      amountPaid,
      salaryMonth, // Example: "June 2025"
      paymentMethod,
      paidBy,
      schoolId
    } = req.body;

    if (!teacherId || !amountPaid || !salaryMonth || !paymentMethod || !paidBy || !schoolId) {
      return res.status(400).json({ error: 'Required fields missing.' });
    }

    const existing = await TeacherSalary.findOne({ teacherId, salaryMonth });
    if (existing) {
      return res.status(409).json({ error: 'Salary already exists for this teacher and month.' });
    }

    const newSalary = await TeacherSalary.create({
      teacherId,
      amountPaid,
      salaryMonth,
      paymentMethod,
      paidBy,
      
      schoolId
    });

    res.json(newSalary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get teacher salaries by month and year
export const getTeacherSalaryByMonthAndYear = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required.' });
    }

    const salaryMonth = `${month} ${year}`;
    const salaries = await TeacherSalary.find({ salaryMonth })
      .populate('teacherId', 'name fatherName email')
      .populate('schoolId', 'name');

    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
