import { accessShareLink, createShareLink, deleteShareLink, getUsetShareLink } from "../controllers/shareController.js"
import {protect} from "../middlewares/auth.js"
import express from "express"

const shareRoute = express.Router()

shareRoute.post("/create",protect,createShareLink)
shareRoute.get("/",protect,getUsetShareLink)
shareRoute.delete("/:id",protect,deleteShareLink)
shareRoute.get("/access/:token",accessShareLink)

export default shareRoute
