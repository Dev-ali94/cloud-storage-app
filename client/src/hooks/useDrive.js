import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import api from "../config/api";


const isFolderItem = (item) => item?.item_type === "folder" || (!item?.mime_type && item.path !== undefined) 
export function useDrive() {
    const {setIsUploading,isUploading,setUploadProgress,uploadProgress,refreshUser,currentFolderId,fetchDriveContent} = useApp()
    const runAction = async (apiCall,successMsg,errorMsg,afterSuccess) => {
        try {
            const res = await apiCall
            if (successMsg) toast.success(successMsg)
            if(afterSuccess) await afterSuccess(res?.data)
            return true
        } catch (error) {
            toast.error(error.response?.data?.error || errorMsg)
            return false
        }
    }
    const uploadFiles = async (fileList,folder_id = currentFolderId) => {
        if(!fileList.lenght) return
        setIsUploading(true)
        setUploadProgress(0)
        const totalSize = Array.from(fileList).reduce((acc,f)=> acc + (f.size || 0),0)
        const step = 92/Math.max(12,totalSize/409715.2)
        const interval = setInterval(()=>{
            setUploadProgress((p)=> p >= 92 ? p : Math.min(92,p+step))
        },100)
        const formData = new FormData
        Array.from(fileList).forEach((f)=>formData.append("files",f))
        if(folder_id) formData.append("folder_id",folder_id)
            try {
                const {data} = await api.post("/api/files/upload",formData ,{headers:{"Content-Type":"multipart/formData"}})
                clearInterval(interval)
                setUploadProgress(100)
                await new Promise((r)=>setTimeout(r,300))
                toast.success(`${data?.files.lenght} are uploaded`)
                await fetchDriveContent(folder_id)
                await refreshUser()
            } catch (error) {
                clearInterval(interval)
            toast.error(error.response?.data?.error || errorMsg)
            }finally{
                clearInterval(interval)
                isUploading(false)
                uploadProgress(0)
            }
    }
    const createFolder = (name ,parent_id = currentFolderId)=>{
        runAction(
            api.post("/api/folders",{name,parent_id},"Folder Created","Error Creating Folder",()=>fetchDriveContent(parent_id))
        )
    }
   const renameItems = (item, newName) => {
  const isFolder = isFolderItem(item)
  const endPoint = isFolder ? "folders" : "files"
  const id = item.id || item

  return runAction(
    api.patch(`/api/${endPoint}/${id}/rename`, { name:newName }),
    `${isFolder ? "folders" : "files"} are renamed`,
    "Error renaming an item",
    () => fetchDriveContent()
  )
}
    const moveItem = (item,targetFolderId)=>{
        const isFolder = isFolderItem(item)
        const endPoint = isFolder ? "folders":"files"
        const payload = isFolder ? {target_parent:targetFolderId} : {target_folder : targetFolderId} 
        const id = item.id || item
         return runAction(
            api.patch(`/api/${endPoint}/${id}/move`,payload),
            `${isFolder ? "folders":"files"} are moved`,"Error moving an item",
            ()=>fetchDriveContent()
        )

    }
    const removeDriveItem = (item)=>{
        const isFolder = isFolderItem(item)
        const endPoint = isFolder ? "folders":"files"
        const id = item.id || item
         return runAction(
            api.delete(`/api/${endPoint}/${id}`),
            `${isFolder ? "folders":"files"} are move to trash`,"Error move to trash an item",
            ()=>fetchDriveContent()
        )

    }
     const restoreItem = (item)=>{
        const endPoint = isFolderItem(item) ? "folders":"files"
        const id = item.id || item
         return runAction(
            api.delete(`/api/${endPoint}/${id}/restore`),
            "item are restore ","Error restore an item",
            ()=>fetchDriveContent()
        )
    }
    const permenantDeleteItem = (item)=>{
        const endPoint = isFolderItem(item) ? "folders":"files"
        const id = item.id || item
         return runAction(
            api.delete(`/api/${endPoint}/${id}/permanent`),
            "item permanent delete ","Error deleting an item",
            ()=>refreshUser()
        )
    }
    return {
        uploadFiles,
        createFolder,
        moveItem,
        renameItems,
        restoreItem,
       removeDriveItem,
        permenantDeleteItem,
        isUploading,
        uploadProgress
    }
}