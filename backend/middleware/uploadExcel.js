import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    console.log(file)
    if (
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files allowed!"));
    }
  },
});

export default upload;
