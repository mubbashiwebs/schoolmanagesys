import GeneralRegister from "../models/generalregister.js";

export const addGeneralRegister = async (req, res) => {
  try {
    const { campusId, registerName } = req.body;

    if (!campusId || !registerName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Register already exists check
    const exists = await GeneralRegister.findOne({
      schoolId: req.user.school,
      campusId,
      registerName: registerName,
    });
    console.log(exists)

    if (exists) {
      
      return res.json({
        success: false,
        message: "This register already exists for this campus",
      });
    }

    const newRegister = await GeneralRegister.create({
      schoolId: req.user.school,
      campusId,
      registerName,
      createdBy: req.user._id,
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
    console.log('Fetching all registers for school:', req.user.school);
   var schoolId = req.user.school
   
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
    const { campusId } = req.query;
    console.log(campusId)
    const registers = await GeneralRegister.find({ schoolId: req.user.school, campusId }).populate('campusId')
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

export const updateRegister = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 Ownership + existence check
    const exist = await GeneralRegister.findOne({
      _id: id,
      schoolId: req.user.school
    });

    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "Register not found"
      });
    }

    // ✅ Duplicate check (safe)
    const sameExist = await GeneralRegister.findOne({
      _id: { $ne: id },
      registerName: req.body.registerName,
      campusId: req.body.campusId,
      schoolId: req.user.school
    });

    if (sameExist) {
      return res.status(400).json({
        success: false,
        message: "This register already exists"
      });
    }

    // 🔐 Whitelist update fields
    const updateData = {
      registerName: req.body.registerName,
      campusId: req.body.campusId
    };

    const updatedRegister = await GeneralRegister
      .findOneAndUpdate(
        { _id: id, schoolId: req.user.school },
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .populate('campusId');

    res.status(200).json({
      success: true,
      data: updatedRegister,
      message: "Register updated successfully"
    });

  } catch (error) {
    console.error("Update Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};