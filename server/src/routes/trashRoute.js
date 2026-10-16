import express from "express"
import { emptyTrash, getTrashItems } from "../controllers/trashController.js"
const trashRoute = express.Router()

trashRoute.get("/",getTrashItems)
trashRoute.delete("/empty",emptyTrash)

export default trashRoute
