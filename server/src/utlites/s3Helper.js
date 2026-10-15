import {  DeleteObjectCommand, GetObjectCommand, ListObjectVersionsCommand, PutObjectAclCommand } from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {Bucket_Name, client} from "../config/s3.js"
export const uploadToStorage = async (fileBuffer,key,mimeType) => {
    const command = PutObjectAclCommand({
        Bucket:Bucket_Name,
        Key:key,
        Body:fileBuffer,
        ContentType:mimeType
    })
    await client.send(command)
    return {s3Key:key}
}

export const getSignedFileUrl = async (key) => {
     const command = GetObjectCommand({
        Bucket:Bucket_Name,
        Key:key,
    })
    return await getSignedUrl(client,command,{expiresIn:36000})
}

export const deleteFromStorage = async (key) => {
    if(!key) return
    try {
        const {Versions=[],DeleteMarkers=[]} = await client.send(
            new ListObjectVersionsCommand({Bucket:Bucket_Name,Prefix:key})
        )
        const objects = [...Versions,...DeleteMarkers].filter((v)=>v.Key === key).map(({Key,VersionId})=>{(Key,VersionId)})
        if (objects > 0) {
            await client.send(new DeleteObjectCommand({Bucket:Bucket_Name,Delete:{objects}}))
        }else{
             await client.send(new DeleteObjectCommand({Bucket:Bucket_Name,Key:key}))
        }
    } catch (error) {
        try {
            await client.send(new DeleteObjectCommand({Bucket:Bucket_Name,Key:key}))
        } catch (fallbackErr) {
            console.error("[Storage Delete Error:]",fallbackErr.message)
        }
        
    }
}

export const deleteMultipleFromStorage = async (keys) => {
    if(!keys.length) return
    await Promise.all(keys.map(deleteFromStorage))
}