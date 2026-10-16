import {  DeleteObjectsCommand, GetObjectCommand, ListObjectVersionsCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {Bucket_Name, client} from "../config/s3.js"


export const uploadToStorage = async (fileBuffer, key, mimetype) => {
    await client.send(
        new PutObjectCommand({
            Bucket: Bucket_Name,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype
        })
    );
    return { s3Key: key };
};

export const getSignedFileUrl = async (key) => {
     const command = new GetObjectCommand({
        Bucket:Bucket_Name,
        Key:key,
    })
    return await getSignedUrl(client,command,{expiresIn:36000})
}

export const deleteFromStorage = async (key) => {
    if (!key) return;
    try {
        const {Versions=[],DeleteMarkers=[]} = await client.send(
            new ListObjectVersionsCommand({Bucket:Bucket_Name,Prefix:key})
        )
        const objects = [...Versions,...DeleteMarkers].filter((ver)=> ver.Key === key ).map(({Key,VersionId})=>({Key,VersionId}))
        if (objects.length > 0) {
            await client.send(new DeleteObjectsCommand({Bucket:Bucket_Name,Delete:{objects}}))
        }else{
             await client.send(new DeleteObjectsCommand({Bucket:Bucket_Name,Key:key}))
        }
    } catch (error) {
        try {
             await client.send(new DeleteObjectsCommand({Bucket:Bucket_Name,Key:key}))
        } catch (fallbackErr) {
            console.error("[Storage Delete Error]:", fallbackErr);
            throw error;      
        }
    }
};

export const deleteMultipleFromStorage = async (keys) => {
if(!keys?.length) return
await Promise.all(keys.map(deleteFromStorage(keys)))
};




