import {adjustUserStorage, cleanUpShareLinks, permanentDeleteFileRecorde} from "../services/storageServices.js"
import {getSignedFileUrl, uploadToStorage} from "../utlites/s3Helper.js"
import {sql} from "../config/db.js"
import crypto from "crypto"
import path from "path"

// sort options
export const SORT_MAP = {
    name_asc:"name ASC",
    name_desc:"name DESC",
    date_asc:"created_at ASC",
    date_desc:"created_at DESC",
    size_asc:"size ASC",
    size_desc:"size DESC"
}
// upload file 
export const uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({error: "No files uploaded.Please upload file"});
        }
        const totalNewBytes = req.files.reduce((total, file) => total + file.size,0);
        if (Number(req.user.storage_used) + totalNewBytes > Number(req.user.storage_limit)) {
            const limitGb = (Number(req.user.storage_limit) / (1024 * 1024 * 1024)).toFixed(1);
            return res.status(413).json({error: `Upload exceeds storage quota limit of ${limitGb} GB`});
        }
        const folderId = req.body.folder_id ?? req.body.folderId;
        let targetFolderId = null;

        if (folderId && folderId !== "null" && folderId !== "root") {
            const [folder] = await sql`
            SELECT id FROM folders WHERE id = ${folderId} AND owner_id = ${req.user.id} AND is_trashed = false`

            if (!folder) {
            return res.status(404).json({error: "Folder not found"});
            }
            targetFolderId = folder.id;
        }

        const createdFiles = await Promise.all(
            req.files.map(async (multerFile) => {
                const fileExt = path.extname(multerFile.originalname);
                const randomString = crypto.randomBytes(8).toString("hex");
                const s3Key = `users/${req.user.id}/${Date.now()}_${randomString}${fileExt}`;
                await uploadToStorage(multerFile.buffer,s3Key,multerFile.mimetype);

                const [row] = await sql`
                    INSERT INTO files (name,original_name,mime_type,size,s3_key,folder_id,owner_id)
                    VALUES (${multerFile.originalname},${multerFile.originalname},${multerFile.mimetype},
                    ${multerFile.size},${s3Key},${targetFolderId},${req.user.id})
                    RETURNING *`
                return row;
            })
        );

        const updateStorage = await adjustUserStorage(req.user.id,totalNewBytes);
        return res.status(201).json({files: createdFiles,storage_used: updateStorage});

    } catch (error) {
        return res.status(500).json({error: error.message || "Internal server error from upload file"});
    }
};
// fetch file data
export const getFiles = async (req, res) => {
  try {
    const {folder_id,folder,search = "",sort = "name_asc",page = "1",limit = "50",} = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const offset = (pageNum - 1) * limitNum;
    const targetFolder = folder_id ?? folder;
    const targetFolderId = !targetFolder || targetFolder === "null" || targetFolder === "root" ? null : targetFolder;
    const searchTerm = search.trim();
    const isSearch = searchTerm.length > 0;
    const pattern = `%${searchTerm}%`;

    const orderBy = SORT_MAP[sort] || SORT_MAP.name_asc;

    const [rows, countRows] = await Promise.all([
      sql`
        SELECT * FROM files WHERE owner_id = ${req.user.id} AND is_trashed = false
        AND((${isSearch}::boolean = true AND name ILIKE ${pattern})
        OR(${isSearch}::boolean = false AND folder_id IS NOT DISTINCT FROM ${targetFolderId}))
        ORDER BY ${sql.unsafe(orderBy)} LIMIT ${limitNum} OFFSET ${offset}`,

      sql`
        SELECT COUNT(*) AS total FROM files WHERE owner_id = ${req.user.id} AND is_trashed = false
        AND ((${isSearch}::boolean = true AND name ILIKE ${pattern})
        OR(${isSearch}::boolean = false AND folder_id IS NOT DISTINCT FROM ${targetFolderId}))`
    ])

    const totalFiles = Number(countRows[0].total);

    return res.status(200).json({
      files: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalFiles,
        totalPages: Math.ceil(totalFiles / limitNum),
      },
    });
  } catch (error) {;
    return res.status(500).json({error: error.message || "Internal server error from fetch file data"});
  }
};
// fetch file preview url
export const getFileOrPreviewUrl = async (req,res) => {
    try {
         const [file] = await sql `SELECT * FROM files WHERE id =${req.params.id} AND owner_id = ${req.user.id}`
         if (!file) {
            return res.status(401).json({error:"File not exist"})
         }
         const downloadUrl = await getSignedFileUrl(file.s3_key)
         return res.status(201).json({url:downloadUrl,file})
    } catch (error) {
        return res.status(500).json({error:error.message || "Internal server error from get preview url"})
    }
}
// rename file
export const renameFile = async (req,res) => {
    try {
        const {name} = req.body
        if (!name) {
            return res.status(401).json({error:"new name are required for rename"})
        }
        const [file]= await sql `UPDATE files SET name = ${name.trim()},updated_at = NOW() WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = false RETURNING *`
        if (!file) {
            return res.status(401).json({error:"file not exist"})
        }
        return res.status(201).json({file})
    } catch (error) {
        return res.status(500).json({error:error.message || "Internal server error from rename file"})
    }
}
// move file
export const moveFile = async (req, res) => {
    try {
        const targetFolder = req.body.target_folder ?? req.body.targetFolder ?? null;

        if (targetFolder !== null && targetFolder !== "" && targetFolder !== "root") {
            const [destFolder] = await sql`
                SELECT id FROM folders WHERE id = ${targetFolder} AND owner_id = ${req.user.id} AND is_trashed = false`
            if (!destFolder) {
                return res.status(404).json({error: "Destination folder not found"});
            }
        }

        const folderId = !targetFolder || targetFolder === "root" ? null : targetFolder;

        const [file] = await sql`
            UPDATE files SET folder_id = ${folderId},updated_at = NOW()
            WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = false
            RETURNING * `

        if (!file) {
            return res.status(404).json({error: "file not found"});
        }

        return res.status(200).json({message: "File moved successfully",file});

    } catch (error) {
        return res.status(500).json({error: error.message || "Internal server error from move file"});
    }
};
// move file to trash
export const softDeleteFile = async (req,res) => {
    try {
        const [file] = await sql `UPDATE files SET is_trashed = true,trashed_at = NOW(), 
        updated_at = NOW() WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = false RETURNING *`
        if (!file) {
            return res.status(401).json({error:"file not Found"})
        }
        await cleanUpShareLinks([file.id],[])
        return res.status(201).json({message:"file are move toward trash"})
    } catch (error) {
        return res.status(500).json({error:error.message || "Internal server error from trash file"})
    }
}
// restore file from trash
export const restoreFile = async (req,res) => {
    try {
         const [file] = await sql `UPDATE files SET is_trashed = false,trashed_at = Null,
         updated_at = NOW() WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = true RETURNING *`
        if (!file) {
            return res.status(401).json({error:"file not found in trash"})
        }
        return res.status(201).json({message:"file are now restore form trash"})
    } catch (error) {
        return res.status(500).json({error:error.message || "Internal server error from restore file"})
    }
}
// delete file from trash
export const permanentDeleteFile = async (req,res) => {
    try {
        const [file] = await sql `SELECT * FROM files WHERE id = ${req.params.id} AND owner_id = ${req.user.id}`
        if (!file) {
            return res.status(404).json({error:"file not found in trash"})
        }
        await permanentDeleteFileRecorde(file,req.user.id)
        return res.status(201).json({message:"File are now deleted from trash"})
    } catch (error) {
        return res.status(500).json({error:error.message || "Internal server error from delete file"})
    }
}