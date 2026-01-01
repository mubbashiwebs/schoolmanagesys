// import Student from "../models/student.js";
// import Class from "../models/class.js";

// export const addClass = async(req,res)=>{
//     try {
//         const isClassExist = await Class.findOne({
//             schoolId: req.body.schoolId,
//             name: req.body.name,
//             campusId: req.body.campusId
//         });

//         if (isClassExist) {
//             return res.status(400).json({ message: "Class Already Exist" });
//         }

//         const classData = new Class(req.body);
//         await classData.save();
//         var newClass = await Class.findOne({name : classData.name, schoolId : classData.schoolId , campusId:classData.campusId , generalRegister:classData.generalRegister}).populate('schoolId', 'name').populate('campusId','name').populate('generalRegister')
            
//         res.status(200).json({ data: newClass, message: 'Successfully added' });
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({ message: error.message });
//     }
// }


// // for super admin
// export const getAllClasses = async (req,res)=>{
//     console.log(req.params.schoolId)
//     try {
//            var allClasses = await Class.find({schoolId:req.params.schoolId}).populate('campusId','name').populate('generalRegister')
//            console.log(allClasses)
//     if(allClasses.length >0){
//      res.status(200).json({data:allClasses,message:'sucessfully Found'})

//     }
//     else{
//             res.status(404).json({data:[],message:'Data not Found'})

//     }
//     } catch (error) {
//                res.status(500).json({message:"server error"})
//     }
 
// }

// export const getAllClassesByCampus = async (req,res)=>{
//     console.log(123)

//     try {
//            var allClasses = await Class.find({schoolId:req.params.schoolId,campusId:req.params.campusId})
//     if(allClasses.length >0){
//      res.json({data:allClasses,message:'sucessfully Found'})
//         console.log(allClasses)
//     }
//     else{
//             res.json({data:[],message:'Data not Found'})

//     }
//     } catch (error) {
//                res.json({message:"server error"})
//     }
 
// }

// export const deleteClass= async (req,res)=>{
//     try {
//         const classdata = await Class.findByIdAndDelete(req.params.id)
//         if(!classdata){
//       return res.status(404).json({ message: 'School not found' });

//         }
//     res.json({ message: 'Class deleted successfully' });

//     } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
        
//     }
// }

// export const updateClass = async (req, res) => {
//   const { id } = req.params;
// //   const { name, contactNo, address } = req.body;

//   try {
//     const updatedClass = await Class.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true, runValidators: true }
//     ).populate('schoolId',"name").populate('campusId','name').populate('generalRegister')

//     if (!updatedClass) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     var linkedStudents = await Student.find({ class: updatedClass._id });
//     console.log(linkedStudents)
//     for (let student of linkedStudents) {
//       student.feeDetails['school'].originalFee = updatedClass.fee;
      
//       student.feeDetails['school'].payableFee = updatedClass.fee - student.feeDetails['school'].discount
//       await student.save();
//     }

//     res.status(200).json({
//       message: "Class updated successfully",
//       data: updatedClass,
//     });
//   } catch (error) {
//     console.error("Update Class Error:", error);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


import Student from "../models/student.js";
import Class from "../models/class.js";

export const addClass = async(req,res)=>{
    try {
        const isClassExist = await Class.findOne({
            schoolId: req.body.schoolId,
            name: req.body.name,
            campusId: req.body.campusId
        });

        if (isClassExist) {
            return res.status(400).json({ message: "Class Already Exist" });
        }

        const classData = new Class(req.body);
        await classData.save();
        var newClass = await Class.findOne({
            name : classData.name,
            schoolId : classData.schoolId,
            campusId: classData.campusId,
            generalRegister: classData.generalRegister
        })
        .populate('schoolId', 'name')
        .populate('campusId','name')
        .populate('generalRegister');
            
        res.status(200).json({ data: newClass, message: 'Successfully added' });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: error.message });
    }
}


// for super admin
export const getAllClasses = async (req,res)=>{
    console.log(req.params.schoolId)
    try {
        var allClasses = await Class.find({schoolId:req.params.schoolId})
        .populate('campusId','name')
        .populate('generalRegister');

        console.log(allClasses)

        if(allClasses.length > 0){
            res.status(200).json({ data: allClasses, message:'sucessfully Found' })
        } else {
            res.status(404).json({ data: [], message:'Data not Found' })
        }
    } catch (error) {
        res.status(500).json({ message:"server error" })
    }
}

export const getAllClassesByCampus = async (req,res)=>{
    console.log(123)

    try {
        var allClasses = await Class.find({
            schoolId:req.params.schoolId,
            campusId:req.params.campusId
        });

        if(allClasses.length > 0){
            res.status(200).json({ data: allClasses, message:'sucessfully Found' })
            console.log(allClasses)
        } else {
            res.status(404).json({ data: [], message:'Data not Found' })
        }
    } catch (error) {
        res.status(500).json({ message:"server error" })
    }
}

export const deleteClass= async (req,res)=>{
    try {
        const classdata = await Class.findByIdAndDelete(req.params.id)
        if(!classdata){
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const updateClass = async (req, res) => {
  const { id } = req.params;

  try {
    const existingClass = await Class.findOne({
          _id: { $ne: id },
          name: req.body.name,
          schoolId: req.body.schoolId,
            campusId: req.body.campusId

        });
    console.log(existingClass)
        if (existingClass) {
          return res.status(400).json({ message: "Class already exists." });
        }
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('schoolId',"name")
    .populate('campusId','name')
    .populate('generalRegister');

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    var linkedStudents = await Student.find({ class: updatedClass._id });
    console.log(linkedStudents)

    for (let student of linkedStudents) {
      student.feeDetails['school'].originalFee = updatedClass.fee;
      student.feeDetails['school'].payableFee =
        updatedClass.fee - student.feeDetails['school'].discount;
      await student.save();
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
