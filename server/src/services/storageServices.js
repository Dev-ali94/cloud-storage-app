import {sql} from "../config/db.js"
import { deleteMultipleFromStorage } from "../utlites/s3Helper.js"

export const getFolderHieryarchyIds = async (folderId,ownerId) => {
    const descendants = await sql ` SELECT id FROM folders WHERE ${folderId} = ANY(path::text[]) AND owner_id = ${ownerId}`
    return [folderId ,...descendants.map((f)=>f.id)]
}
export const cleanUpShareLinks = async (fileIds=[],folderIds=[]) => {
    if(fileIds.length ===  0 && folderIds.length === 0) return
    const allIds = [...folderIds,...fileIds]
    await sql `DELETE FROM share_links WHERE resource_id = ANY(${allIds}::uuid[])`
}

export const softDeleteFolderHieryarchy = async (folderId, ownerId) => {
  const allFolderIds = await getFolderHieryarchyIds(folderId, ownerId);

  const files = await sql`
    SELECT id
    FROM files
    WHERE folder_id = ANY(${allFolderIds}::uuid[])
      AND owner_id = ${ownerId}
  `;

  const fileIds = files.map((f) => f.id);
  const now = new Date();

  const queries = [
    sql`
      UPDATE folders
      SET is_trashed = true,
          trashed_at = ${now},
          updated_at = NOW()
      WHERE id = ANY(${allFolderIds}::uuid[])
        AND owner_id = ${ownerId}
    `
  ];

  if (fileIds.length > 0) {
    queries.push(sql`
      UPDATE files
      SET is_trashed = true,
          trashed_at = ${now},
          updated_at = NOW()
      WHERE id = ANY(${fileIds}::uuid[])
        AND owner_id = ${ownerId}
    `);
  }

  await Promise.all(queries);

  await cleanUpShareLinks(fileIds, allFolderIds);
};
export const restoreFolderHieryarchy = async (folderId, ownerId) => {
  const allFolderIds = await getFolderHieryarchyIds(folderId, ownerId);

  // Get files inside these folders
  const files = await sql`
    SELECT id
    FROM files
    WHERE folder_id = ANY(${allFolderIds}::uuid[])
      AND owner_id = ${ownerId}
  `;

  const fileIds = files.map((file) => file.id);

  const queries = [
    sql`
      UPDATE folders
      SET is_trashed = false,
          trashed_at = NULL,
          updated_at = NOW()
      WHERE id = ANY(${allFolderIds}::uuid[])
        AND owner_id = ${ownerId}
    `
  ];

  if (fileIds.length > 0) {
    queries.push(sql`
      UPDATE files
      SET is_trashed = false,
          trashed_at = NULL,
          updated_at = NOW()
      WHERE id = ANY(${fileIds}::uuid[])
        AND owner_id = ${ownerId}
    `);
  }

  await Promise.all(queries);
};

export const adjustUserStorage = async (userId,deltaBytes) => {
    const [user] = await sql `UPDATE users SET storage_used = GREATEST(0,storage_used + ${deltaBytes}) updated_at = NOW() WHERE id = ${userId} RETURNING storage_used`
    return user ? Number(user.storage_used) : null
}

export const permanentDeleteFolderHieryarchy = async (folderId,ownerId) => {
    const allFolderIds = await getFolderHieryarchyIds(folderId,ownerId)
    const files = await sql `SELECT id s3_key,size FROM files WHERE folder_id = ANY(${allFolderIds}::uuid[]) AND owner_id = ${ownerId}`
    const s3Key = files.map((f)=>f.s3_key)
    const filesIds = files.map((f)=>f.id)
    const totalFreesSize = files.reduce((acc,f)=> acc + Number(f.size),0)
    await Promise.all(
        s3Key.length > 0 ? deleteMultipleFromStorage(s3Key) : Promise.resolve(),
        cleanUpShareLinks(filesIds,allFolderIds),
        filesIds.length >0 ? sql `DELETE FROM files WHERE id = ANY(${filesIds}::uuid[])` : Promise.resolve(),
        sql `DELETE FROM folders WHERE  id = ANY(${allFolderIds}::uuid[])`
    )
    if (totalFreesSize > 0) {
         await adjustUserStorage(ownerId,-totalFreesSize)
    }
    await deleteMultipleFromStorage()

}