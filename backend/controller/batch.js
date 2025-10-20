import Batch from "../models/batch.js";

// Add Batch

export const addBatch = async (req, res) => {
  try {
    console.log("Incoming Batch:", req.body);

    // step 1: check if batch already exist
    const isBatchExist = await Batch.findOne({
      schoolId: req.body.schoolId,
      campusId: req.body.campusId,
      name: req.body.name,
      courseName: req.body.courseName,
    });

    if (isBatchExist) {
      return res.json({ message: "Batch Already Exist" });
    }

    // step 2: set courseTypeModel based on courseType
    if (req.body.courseType === "computer") {
      req.body.courseTypeModel = "Course";
    } else if (req.body.courseType === "english") {
      req.body.courseTypeModel = "EnglishCourse";
    }

    // step 3: create and save batch
    const batchData = new Batch(req.body);
    await batchData.save();

    // step 4: fetch newly created batch with populate
    const newBatch = await Batch.findOne({
      _id: batchData._id,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name")
      .populate("courseName", "name"); // course name bhi populate hoga

    res.json({ data: newBatch, message: "Successfully added" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Batches (By School - for Super Admin)
export const getAllBatches = async (req, res) => {
    console.log(req.params.schoolId)    
  try {
    const allBatches = await Batch.find({ schoolId: req.params.schoolId })
      .populate("campusId", "name")
      .populate("courseName", "name"); // course name bhi populate hoga

    console.log(allBatches)
    if (allBatches.length > 0) {
      res.json({ data: allBatches, message: "Successfully Found" });
      console.log(allBatches)
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Batches Error:", error);
    res.json({ message: "Server error" });
  }
};

// // Get All Batches By Campus
export const getAllBatchesByCampus = async (req, res) => {
    console.log(123);
  try {
    const allBatches = await Batch.find({
      schoolId: req.params.schoolId,
      campusId: req.params.campusId,
    }).populate("courseName", "name"); // course name bhi populate hoga

    if (allBatches.length > 0) {
      res.json({ data: allBatches, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Batches By Campus Error:", error);
    res.json({ message: "Server error" });
  }
};

// // Get All Batches By Campus
export const getAllComputerBatchesByCampus = async (req, res) => {
    console.log(123);
  try {
    const allBatches = await Batch.find({
      schoolId: req.params.schoolId,
      campusId: req.params.campusId,
      courseType: "computer",
    }).populate("courseName", "name"); // course name bhi populate hoga
    console.log(allBatches , 'computer batches')
    if (allBatches.length > 0) {
      res.json({ data: allBatches, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Batches By Campus Error:", error);
    res.json({ message: "Server error" });
  }
};

export const getAllEnglishBatchesByCampus = async (req, res) => {
    console.log(123);
  try {
    const allBatches = await Batch.find({
      schoolId: req.params.schoolId,
      campusId: req.params.campusId,
      courseType: "english",
    }).populate("courseName", "name"); // course name bhi populate hoga

    if (allBatches.length > 0) {
      res.json({ data: allBatches, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Batches By Campus Error:", error);
    res.json({ message: "Server error" });
  }
};



// Delete Batch
export const deleteBatch = async (req, res) => {
  try {
    const batchData = await Batch.findByIdAndDelete(req.params.id);
    if (!batchData) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Delete Batch Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Batch
export const updateBatch = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name")
      .populate("courseName", "name"); // course name bhi populate hoga


    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({
      message: "Batch updated successfully",
      data: updatedBatch,
    });
  } catch (error) {
    console.error("Update Batch Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
