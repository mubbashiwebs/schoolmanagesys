import GeneralRegister from "../models/generalregister.js";

export const addGeneralRegister = async (req, res) => {
  try {
    const { schoolId, campusId, registerName } = req.body;
    console.log(req.body)
    if (!registerName) {
      return res.status(400).json({
        success: false,
        message: "Register name is required",
      });
    }

    // Register already exists check
    const exists = await GeneralRegister.findOne({
      schoolId,
      campusId,
      registerName: registerName,
    });
    console.log(exists)

    if (exists) {
        console.log('working')
      return res.json({
        success: false,
        message: "This register already exists for this campus",
      });
    }

    const newRegister = await GeneralRegister.create({
      schoolId,
      campusId,
      registerName,
    })
    
    const RegisterCopy = await GeneralRegister.findOne({_id:newRegister._id}).populate('campusId')
    return res.json({
      success: true,
      message: "General Register created successfully",
      data: RegisterCopy,
    });

  } catch (error) {
    console.log(error.message)
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllRegisters = async (req, res) => {
  try {
    const { schoolId } = req.query;
    console.log(schoolId)
    const registers = await GeneralRegister.find({ schoolId }).populate('campusId')
    if(registers.length > 0){
    return res.json({
      success: true,
      data: registers,
    });
}
else{
      return res.json({
      success: false,
      data: [],
      message:'Data not Found'
    });
}

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRegistersByCampus = async (req, res) => {
  try {
    const { schoolId , campusId } = req.query;
    console.log(schoolId)
    const registers = await GeneralRegister.find({ schoolId , campusId }).populate('campusId')
    if(registers.length > 0){
    return res.json({
      success: true,
      data: registers,
    })
}
else{
      return res.status(404).json({
      success: false,
      data: [],
      message:'Data not Found'
    });
}

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteRegister = async (req, res) => {
  try {
    const { id } = req.params;

    await GeneralRegister.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Register deleted successfully"
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRegister = async (req,res)=>{
    try {
        var id = req.params.id
        var exist = await GeneralRegister.findById(id)
        if(!exist){
            return res.json({success:false , message:"Register not found"})
        }
        var sameExist = await GeneralRegister.findOne(req.body)
        if(sameExist){
          return res.json({success:false,message:'This Regster is already exist'})
        }
        var updatedRegister = await GeneralRegister.findByIdAndUpdate(id ,  { new: true}).populate('campusId')
        res.json({success:true , data:updatedRegister, message:'Register Upated Successfully'})
    } catch (error) {
            res.json(error.message)
    }
}