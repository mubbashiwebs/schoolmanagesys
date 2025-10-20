import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    userId: {type:String , required:true},

    name:{type:String , required:true},
    contact : {type:Number,required:true},
    address: {type:String,required:true},
    features:[String],
    campus : {type:String , required:false},
    status :{type:String , default: 'approved'}
    
})

const school = new mongoose.model('school' , schoolSchema)
export default school