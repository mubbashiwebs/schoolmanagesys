import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  email: { type: String, required: true},
  username: { type: String, required: true},
  password: { type: String, required: true },
  designation: { type: String, required: true },
  allowedPages : [String],
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
  contactNo: { type: String, required: true },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
      }
  
});

const User= mongoose.models.User || mongoose.model('User', userSchema);

export default User;