import { sql } from "../config/db.js"
import {softDeleteFolderHieryarchy,restoreFolderHieryarchy,permanentDeleteFolderHieryarchy} from "../services/storageServices.js"

export const createFolder = async (req, res) => {
    try {
        const { name, parent, parent_id } = req.body
        const targetParent = parent_id ?? parent
        if (!name.trim()) {
            return res.status(401).json({ error: "Name required for folder" })
        }
        let folderPath = []
        if (targetParent) {
            const [parentFolder] = await sql`SELECT id , path FROM folders WHERE id = ${targetParent} AND owner_id = ${req.user.id} AND is_trashed = false`
            if (!parentFolder) {
                return res.status(401).json({ error: "Parent Folder not found" })
            }
            folderPath = [...(parentFolder.path || []), parentFolder.id]
        }
        const [existing] = await sql`SELECT id FROM folders WHERE name = ${name.trim()} AND parent_id IS NOT DISTINCT FROM ${targetParent || null} AND owner_id = ${req.user.id} AND is_trashed = false`
        if (existing) {
            return res.status(401).json({ error: "A Folder with this name also exist" })
        }
        const [folder] = await sql`INSERT INTO folders (name,parent_id,owner_id,path) VALUES (${name.trim()},${targetParent},${req.user.id},${folderPath}) RETURNING *`
        return res.status(201).json({ folder, message: "Folder created successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const getFolders = async (req, res) => {
    try {
        const parent = req.query.parent_id ?? req.query.parent
        const parentId = !parent || parent === "null" ? null : parent
        const folders = await sql`SELECT * FROM folders WHERE owner_id = ${req.user.id} AND parent_id IS NOT DISTINCT FROM ${parentId} AND is_trashed = false ORDER BY name ASC`
        return res.status(201).json({ folders })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
export const getFolderDetails = async (req, res) => {
    try {
        const [folder] = await sql`SELECT * FROM folders WHERE id = ${req.params.id} 
         AND owner_id = ${req.user.id} AND is_trashed = false`
        if (!folder) {
            return res.status(401).json({ error: "Folder not Found" })
        }
        const ancestorIds = folder.path || []
        const ancestors = ancestorIds.length > 0 ? await sql`SELECT id,name FROM folders WHERE id = ANY(${ancestorIds}::uuid[])` : []
        const ancestorMap = new Map(ancestors.map((a) => [a.id, a.name]))
        const breadcrumbs = [
            { id: null, name: "My Drive" },
            ...ancestorIds.map((aid) => ({ id: aid, name: ancestorMap.get(aid) ?? "" })),
            { id: folder.id, name: folder.name }
        ]
        return res.status(201).json({ folder, breadcrumbs })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
export const renameFolder = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).json({ error: "Name are required" })
        }
        const [folder] = await sql` UPDATE folders SET name = ${name.trim()},updated_at = NOW() WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = false RETURNING *`
        if (!folder) {
            return res.status(401).json({ error: "Folder not found" })
        }
        return res.status(201).json({ folder })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const moveFolder = async (req, res) => {
    try {
        const targetparernt = req.body.parent_id ?? req.body.targetParent
        const folderId = req.params.id
        if (targetparernt === folderId) {
            return res.status(401).json({ error: "You could not move folder into itself" })
        }
        const [folder] = await sql`SELECT * FROM folders WHERE id = ${folderId} AND owner_id = ${req.user.id} AND is_trashed = false`
        if (!folder) {
            return res.status(401).json({ error: "Folder Not found" })
        }
        let newPath = []
        if (targetparernt) {
            const [targetFolder] = await sql`SELECT * FROM folders WHERE id = ${targetparernt} AND owner_id = ${req.user.id} AND is_trashed = false`
            if (!targetFolder) {
                return res.status(401).json({ error: "Target Folder Not found" })
            }
            const targetpath = targetFolder.path || []
            if (targetpath.includes(folderId)) {
                return res.status(401).json({ error: "Cannot move folder one of its subFolder" })
            }
            newPath = [...targetpath, targetFolder.id]
        }
        await sql`UPDATE folders SET parent_id = ${targetparernt || null},path=${newPath},updated_at = NOW() WHERE id = ${folderId}`

        const descendants = await sql` SELECT id,path FROM folders WHERE ${folderId} = ANY(path::text[]) AND owner_id = ${req.user.id}`
        if (descendants.length > 0) {
            await Promise.all(
                descendants.map((desc) => {
                    const folderIndex = desc.path.findIndex((p) => p === folderId)
                    const subPath = folderIndex !== -1 ? desc.path.slice(folderIndex + 1) : []
                    const updatedPath = [...newPath, folderId, ...subPath]
                    return sql`UPDATE folders SET path = ${updatedPath},updated_at = NOW() WHERE id = ${desc.id}`
                })
            )
        }

        const [updated] = await sql`SELECT * FROM folders WHERE id = ${folderId}`
        return res.status(201).json({folder:updated})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const softDeleteFolder = async (req, res) => {
try {
    const [folder] = await sql `SELECT id FROM folders WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = false`
    if (!folder) {
        return res.status(201).json({error:"Folder not Found"})
    }
    await softDeleteFolderHieryarchy(folder.id,req.user.id)
    return res.status(201).json({message:"Folder move to trash"})
} catch (error) {
    return res.status(500).json({error:error.message})
}
}

export const restoreFolder = async (req, res) => {
try {
    const [folder] = await sql `SELECT id FROM folders WHERE id = ${req.params.id} AND owner_id = ${req.user.id} AND is_trashed = true`
    if (!folder) {
        return res.status(201).json({error:"Folder not Found intrash"})
    }
    await restoreFolderHieryarchy(folder.id,req.user.id)
    return res.status(201).json({message:"Folder restore from trash"})
} catch (error) {
    return res.status(500).json({error:error.message})
}
}


export const permanentDeleteFolder = async (req, res) => {
    try {
        const folderId = req.params.id;
        const ownerId = req.user.id;

        const [folder] = await sql`
            SELECT id
            FROM folders
            WHERE id = ${folderId}
              AND owner_id = ${ownerId}
              AND is_trashed = true
        `;

        if (!folder) {
            return res.status(404).json({
                error: "Folder not found in trash",
            });
        }

        await permanentDeleteFolderHieryarchy(
            folder.id,
            ownerId
        );

        return res.status(200).json({
            message: "Folder permanently deleted from trash",
        });
    } catch (error) {
        console.error("Permanent folder deletion error:", error);

        return res.status(500).json({
            error: error.message || "Failed to permanently delete folder",
        });
    }
};
