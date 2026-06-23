import User from "../models/user.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
dotenv.config()
export const addUser = async (req, res) => {
  console.log(req.body)
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.json({ message: 'User already exists' });
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: 'User added successfully', data: newUser });
  } catch (error) {
    console.log(error)
    res.json({ message: 'Server error', error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('school', 'name').populate('campus', 'name');
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUsersBySchool = async (req, res) => {
  console.log('reach')
  try {
    const users = await User.find({school:req.params.schoolId}).populate('school', 'name').populate('campus', 'name');
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUsersByCampus = async (req, res) => {
  try {
    const users = await User.find({campus:req.params.campusId}).populate('school', 'name').populate('campus', 'name');
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// export const loginUser = async (req,res)=>{
//     console.log(req.body)
//     try {
//         const user = await User.find({email:req.body.email}).populate('school').populate('campus', 'name');
//         if(user.length >0){
//             console.log(user)
//             if(user[0].password === req.body.password){
//                 const token = jwt.sign({id:user._id,schoolId : user.school._id},process.env.JWT_SECRET,{expiresIn:"10m"})
//                 res.cookie("accessToken", token ,{
//                     httpOnly: true,
//                     maxAge: 10 * 60 * 1000,
//                 })
               
//                 res.json({data:user,message:'Suceesfully login'})
//             }
//             else{
//                 res.json({data:null, message:'incorrect password'})
//             }
//         }
//         else{
//                 res.json({data:null, message:'incorrect credentials'})
//         }
//     } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
        
//     }
// }

/* ================= LOGIN ================= */
export let loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('school').populate('campus', 'name');
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email" });
    }

    const match = user.password == password;
    console.log(`Password matching : ${match}`);
    
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        schoolId: user.school?._id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

// userController.js
res.cookie("aToken", token, {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 10 * 24 * 60 * 60 * 1000,
  path: '/'
  // domain: 'localhost' - ye line remove kar do
});

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: [user], // array ki zarurat nahi
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const editUser = async (req,res)=>{
  try {
    var existingUser = await User.findOne({_id : req.params.id})
    if(!existingUser){
     return res.json({message:'User not Found ', data : {}})
    }
    var user = await User.findByIdAndUpdate(req.params.id ,req.body ,{ new: true })
    res.json({data:user , message:'User updated Successfully '})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const getUser = async (req, res) => {  
  try {
    const user = req.user;
    console.log('User data:', user)
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};