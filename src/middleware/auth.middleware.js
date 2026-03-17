import jwt from "jsonwebtoken"

export const protect = (req,res,next)=>{

 let token

 if(req.headers.authorization){

  token=req.headers.authorization.split(" ")[1]

 }

 if(!token){

  return res.status(401).json({message:"No autorizado"})
 }

 try{

  const decoded=jwt.verify(token,process.env.JWT_SECRET)

  req.user=decoded

  next()

 }catch(error){

  res.status(401).json({message:"Token inválido"})

 }

}
