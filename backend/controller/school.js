import School from "../models/school.js";
// import User from "../models/User.js";
import UserForReq from "../models/userforreq.js";
import { sendSchoolStatusEmail } from "../utils/sendMail.js";

export const requestSchool = async (req, res) => {
  const { userId, schoolName, address, contact, campus } = req.body;

  const user = await UserForReq.findOne({userId});
  if (!user || !user.isVerified) return res.status(403).json({ message: "User not verified" });
  const isRequestExist = await School.findOne({name: schoolName , campus})
  if (isRequestExist) return res.status(403).json({ message: "School has been already registered" });

  await School.create({
    userId,
    schoolName,
    address,
    contact,
    campus,
  });

  res.json({ message: "Submitted! We will inform you through email." });
};

export const listPendingSchools = async (req, res) => {
  const pending = await School.find({ status: "pending" }).populate("userId", "email name");
  res.json(pending);
};

export const updateSchoolStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await School.findById(id).populate("userId");
  if (!request) return res.status(404).json({ message: "Not found" });

  request.status = status;
  await request.save();

  await sendSchoolStatusEmail(request.userId.email, status);

  res.json({ message: `School ${status}` });
};


export const addSchool = async (req, res) => {
  console.log("Received body:", req.body);

  try {
    const isSchoolExist = await School.findOne({ name: req.body.name });

    if (isSchoolExist) {
      return res.json({ data: [], message: "School Already Exists" });
    }

    const newSchool = new School(req.body);
    await newSchool.save();

    res.json({ data: newSchool, message: "Successfully added" });
  } catch (error) {
    console.error("Error in addSchool:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllSchools = async (req,res)=>{
    try {
           var allSchools = await School.find({})
    if(allSchools.length >0){
     res.json({data:allSchools,message:'sucessfully Found'})

    }
    else{
            res.json({data:[],message:'Data not Found'})

    }
    } catch (error) {
               res.json({message:"server error"})
    }
 
}

export const deleteSchool = async (req,res)=>{
    try {
        const school = await School.findByIdAndDelete(req.params.id)
        if(!school){
      return res.status(404).json({ message: 'School not found' });

        }
    res.json({ message: 'School deleted successfully' });

    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
        
    }
  }


export const updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, contactNo, address } = req.body;

  try {
    const updatedSchool = await School.findByIdAndUpdate(
      id,
      { name, contactNo, address },
      { new: true, runValidators: true }
    );

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({
      message: "School updated successfully",
      data: updatedSchool,
    });
  } catch (error) {
    console.error("Update School Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
