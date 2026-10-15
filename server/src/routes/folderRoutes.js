import express from "express"
import { protect } from "../middlewares/auth.js"
import { createFolder, getFolderDetails, getFolders, moveFolder, permanentDeleteFolder, renameFolder, restoreFolder, softDeleteFolder } from "../controllers/folderController.js"

const folderRoute = express.Router()

folderRoute.post("/create",createFolder)
folderRoute.get("/",getFolders)
folderRoute.get("/:id",getFolderDetails)
folderRoute.patch("/:id/rename",renameFolder)
folderRoute.patch("/:id/move",moveFolder)
folderRoute.delete("/:id",softDeleteFolder)
folderRoute.post("/:id/restore",restoreFolder)
folderRoute.delete("/:id/delete",permanentDeleteFolder)
export default folderRoute