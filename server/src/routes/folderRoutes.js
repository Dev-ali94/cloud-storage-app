import express from "express"
import { protect } from "../middlewares/auth.js"
import { createFolder, getFolderDetails, getFolders, moveFolder, permanentDeleteFolder, renameFolder, restoreFolder, softDeleteFolder } from "../controllers/folderController.js"

const folderRoute = express.Router()

folderRoute.post("/create",protect,createFolder)
folderRoute.get("/",protect,getFolders)
folderRoute.get("/:id",protect,getFolderDetails)
folderRoute.patch("/:id/rename",protect,renameFolder)
folderRoute.patch("/:id/move",protect,moveFolder)
folderRoute.delete("/:id",protect,softDeleteFolder)
folderRoute.post("/:id/restore",protect,restoreFolder)
folderRoute.delete("/:id/delete",protect,permanentDeleteFolder)
export default folderRoute