import express from "express"
import {getUser, loginUser, logoutUser, registerUser} from "../controllers/authController.js"
import { protect } from "../middlewares/auth.js"

const authRoute = express.Router()

authRoute.post("/register",registerUser)
authRoute.post("/login",loginUser)
authRoute.post("/logout",logoutUser)
authRoute.get("/me",protect,getUser)

export default authRoute