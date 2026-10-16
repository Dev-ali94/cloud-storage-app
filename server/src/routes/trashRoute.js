import { emptyTrash, getTrashItems } from "../controllers/trashController.js"
import express from "express"

const trashRoute = express.Router()

trashRoute.get("/",getTrashItems)
trashRoute.delete("/empty",emptyTrash)

export default trashRoute
