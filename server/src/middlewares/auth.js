import { sql } from "../config/db.js"
import jwt from "jsonwebtoken"

export const protect = async (req,res,next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.status(404).json({error:"You are unauthorized person.please login first"})
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const [user] = await sql`SELECT id,name,email,storage_limit,storage_used,created_at,updated_at
        FROM users WHERE id = ${decode.id}` 
        if (!user) {
            return res.status(404).json({error:"user no longer exist"})
        }
        req.user = user
        next()
    } catch  {
         return res.status(401).json({error:"Token invalid or expired.Please login to countinue"})
    }
}