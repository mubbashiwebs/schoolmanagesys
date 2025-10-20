import campus from "../models/campus.js";
import Class from "../models/class.js";

export const addClass = async(req,res)=>{
    try {
        const isClassExist = await Class.findOne({
            schoolId: req.body.schoolId,
            name: req.body.name,
            campusId: req.body.campusId
        });

        if (isClassExist) {
            return res.json({ message: "Class Already Exist" });
        }

        const classData = new Class(req.body);
        await classData.save();
        var newClass = await Class.findOne({name : classData.name, schoolId : classData.schoolId , campusId:classData.campusId}).populate('schoolId', 'name').populate('campusId','name')
            
        res.json({ data: newClass, message: 'Successfully added' });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


// for super admin
export const getAllClasses = async (req,res)=>{
    console.log(req.params.schoolId)
    try {
           var allClasses = await Class.find({schoolId:req.params.schoolId}).populate('campusId','name')
           console.log(allClasses)
    if(allClasses.length >0){
     res.json({data:allClasses,message:'sucessfully Found'})

    }
    else{
            res.json({data:[],message:'Data not Found'})

    }
    } catch (error) {
               res.json({message:"server error"})
    }
 
}

export const getAllClassesByCampus = async (req,res)=>{
    console.log(123)

    try {
           var allClasses = await Class.find({schoolId:req.params.schoolId,campusId:req.params.campusId})
    if(allClasses.length >0){
     res.json({data:allClasses,message:'sucessfully Found'})
        console.log(allClasses)
    }
    else{
            res.json({data:[],message:'Data not Found'})

    }
    } catch (error) {
               res.json({message:"server error"})
    }
 
}

export const deleteClass= async (req,res)=>{
    try {
        const classdata = await Class.findByIdAndDelete(req.params.id)
        if(!classdata){
      return res.status(404).json({ message: 'School not found' });

        }
    res.json({ message: 'Class deleted successfully' });

    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
        
    }
}

export const updateClass = async (req, res) => {
  const { id } = req.params;
//   const { name, contactNo, address } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('schoolId',"name").populate('campusId','name')

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Update Class Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
