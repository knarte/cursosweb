import User from "../models/User.js"
import bcrypt from "bcrypt"
import {generateToken} from "../utils/generateToken.js"

export const register = async(req,res)=>{

 const {name,email,password}=req.body

 const userExists=await User.findOne({email})

 if(userExists){

  return res.json({message:"Usuario ya existe"})
 }

 const hashed=await bcrypt.hash(password,10)

 const user=await User.create({

  name,
  email,
  password:hashed

 })

 res.json(user)

}

export const login = async(req,res)=>{

 const {email,password}=req.body

 const user=await User.findOne({email})

 if(!user){

  return res.status(400).json({message:"Usuario no existe"})
 }

 const match=await bcrypt.compare(password,user.password)

 if(!match){

  return res.status(400).json({message:"Password incorrecto"})
 }

 res.json({

  token:generateToken(user._id)

 })

}
