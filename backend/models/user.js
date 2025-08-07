import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  cnic: { type: String, required: true},
  email: { type: String, required: true},
  username: { type: String, required: true},
  password: { type: String, required: true },
  designation: { type: String, required: true },
  allowedPages : [String],
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true },
  contactNo: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
export default User;