import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true
 },

 description:{
  type:String
 },

 instructor:{
  type:String
 }

},{timestamps:true})

export default mongoose.model("Course",courseSchema)
