import mongoose from "mongoose";

export const connectDb = async()=>{
   try {
        await mongoose.connect('mongodb+srv://mubbashirwebs:KVs3aAnWejbdZRiU@cluster0.uk1svf0.mongodb.net/schoolmanagementsystem?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
    }
}