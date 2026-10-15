import express from "express"
import { getFileOrPreviewUrl, getFiles, moveFile, permanentDeleteFile, renameFile, restoreFile, softDeleteFile, uploadFiles } from "../controllers/fileController.js"
import { upload } from "../middlewares/upload.js"


const fileRoute = express.Router()

fileRoute.post("/upload",upload.array("files",10),uploadFiles)
fileRoute.get("/",getFiles)
fileRoute.get("/:id/preview",getFileOrPreviewUrl)
fileRoute.patch("/:id/rename",renameFile)
fileRoute.patch("/:id/move",moveFile)
fileRoute.delete("/:id",softDeleteFile)
fileRoute.post("/:id/restore",restoreFile)
fileRoute.delete("/:id/delete",permanentDeleteFile)
export default fileRoute