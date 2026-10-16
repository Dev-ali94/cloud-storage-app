import { sql } from "../config/db.js"
import {emptyTrashHieryarchy} from "../services/storageServices.js"



export const getTrashItems = async (req,res) => {
    try {
        const [files,folders] = await Promise.all([
            sql `SELECT * FROM files WHERE owner_id = ${req.user.id} AND is_trashed = true ORDER BY trashed_at DESC`,
            sql `SELECT * FROM folders WHERE owner_id = ${req.user.id} AND is_trashed = true ORDER BY trashed_at DESC`
        ])
        return res.status(201).json({files,folders})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

export const emptyTrash = async (req,res) => {

    try {
        await emptyTrashHieryarchy(req.user.id)
        return res.status(201).json({message:"Trash Empty SuccessFully"})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
} 



