import User from "../models/user.js";
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
    const users = await User.find().populate('school', 'name');
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

export const loginUser = async (req,res)=>{
    console.log(req.body)
    try {
        const user = await User.find({email:req.body.email}).populate('school', 'name')
        if(user.length >0){
            console.log(user)
            if(user[0].password === req.body.password){
                res.json({data:user,message:'Suceesfully login'})
            }
            else{
                res.json({data:null, message:'incorrect password'})
            }
        }
        else{
                res.json({data:null, message:'incorrect credentials'})
        }
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
        
    }
}