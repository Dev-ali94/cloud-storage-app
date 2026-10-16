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
    if (!key || typeof key !== "string") return;

    try {
        const objects = [];
        let KeyMarker;
        let VersionIdMarker;
        let isTruncated = true;

        while (isTruncated) {
            const response = await client.send(
                new ListObjectVersionsCommand({
                    Bucket: Bucket_Name,
                    Prefix: key,
                    KeyMarker,
                    VersionIdMarker,
                })
            );

            const versions = [
                ...(response.Versions || []),
                ...(response.DeleteMarkers || []),
            ];

            objects.push(
                ...versions
                    .filter((item) => item.Key === key)
                    .map(({ Key, VersionId }) => ({
                        Key,
                        VersionId,
                    }))
            );

            isTruncated = response.IsTruncated === true;
            KeyMarker = response.NextKeyMarker;
            VersionIdMarker = response.NextVersionIdMarker;
        }

        if (objects.length > 0) {
            for (let i = 0; i < objects.length; i += 1000) {
                const result = await client.send(
                    new DeleteObjectsCommand({
                        Bucket: Bucket_Name,
                        Delete: {
                            Objects: objects.slice(i, i + 1000),
                            Quiet: true,
                        },
                    })
                );

                if (result.Errors?.length) {
                    throw new Error(
                        `S3 deletion failed: ${JSON.stringify(result.Errors)}`
                    );
                }
            }
        } else {
            await client.send(
                new DeleteObjectCommand({
                    Bucket: Bucket_Name,
                    Key: key,
                })
            );
        }
    } catch (error) {
        console.error("[Storage Delete Error]:", error);
        throw error;
    }
};

export const deleteMultipleFromStorage = async (keys = []) => {
    const validKeys = [
        ...new Set(
            keys.filter(
                (key) =>
                    typeof key === "string" &&
                    key.trim().length > 0
            )
        ),
    ];

    if (validKeys.length === 0) return;

    const objectsToDelete = [];

    for (const key of validKeys) {
        const keyObjects = [];

        let KeyMarker;
        let VersionIdMarker;
        let isTruncated = true;

        while (isTruncated) {
            const response = await client.send(
                new ListObjectVersionsCommand({
                    Bucket: Bucket_Name,
                    Prefix: key,
                    KeyMarker,
                    VersionIdMarker,
                })
            );

            const versions = [
                ...(response.Versions || []),
                ...(response.DeleteMarkers || []),
            ];

            keyObjects.push(
                ...versions
                    .filter((item) => item.Key === key)
                    .map(({ Key, VersionId }) => ({
                        Key,
                        VersionId,
                    }))
            );

            // IMPORTANT: Do not reference `response` outside
            // its scope. Store pagination state explicitly.
            isTruncated = response.IsTruncated === true;
            KeyMarker = response.NextKeyMarker;
            VersionIdMarker = response.NextVersionIdMarker;
        }

        if (keyObjects.length > 0) {
            objectsToDelete.push(...keyObjects);
        } else {
            // No version records exist for this key.
            objectsToDelete.push({ Key: key });
        }
    }

    for (let i = 0; i < objectsToDelete.length; i += 1000) {
        const batch = objectsToDelete.slice(i, i + 1000);

        const result = await client.send(
            new DeleteObjectsCommand({
                Bucket: Bucket_Name,
                Delete: {
                    Objects: batch,
                    Quiet: true,
                },
            })
        );

        if (result.Errors?.length) {
            console.error(
                "[Bulk Storage Delete Errors]:",
                result.Errors
            );

            throw new Error(
                `Failed to delete ${result.Errors.length} S3 object(s): ` +
                JSON.stringify(result.Errors)
            );
        }
    }
};


