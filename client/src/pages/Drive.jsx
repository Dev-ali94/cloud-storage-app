import React,{useEffect, useState} from 'react'
import BreadCrumb from '../components/layout/BreadCrumb'
import FileGrid from '../components/file/FileGrid'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {useDrive} from "../hooks/useDrive"
import FilePreview from '../components/file/FilePreview'
import ShareModel from '../components/file/ShareModel'
const Drive = () => {
  const navigate = useNavigate()
  const {folderId} = useParams()
  const {fetchDriveContent,setCurrentFolderId} = useApp()
  const {deleteItem:removeDriveItem} = useDrive
  const [previewFile,setPreviewFile] = useState(null)
  const [shareItem,setShareItem] = useState(null)
  const [renameItem,setRenameItem] = useState(null)
  const [moveItem,setMoveItem] = useState(null)
  const [deleteItem,setDeleteItem] = useState(null)
useEffect(()=>{
  const id = folderId || null
  setCurrentFolderId(id)
  fetchDriveContent(id)

},[folderId,fetchDriveContent,setCurrentFolderId])
  return (
    <div className="" >
      <BreadCrumb/>
      <FileGrid onFolderClick={(folder)=> navigate(`/drive/${folder.id}`)} onPreviewFile={setPreviewFile} onShareItem={setShareItem} onMoveItem={moveItem} onDeleteItem={deleteItem} onRenameItem={renameItem} />
        {previewFile && <FilePreview file={previewFile} onClose={()=> setPreviewFile(null)}/>}
        {shareItem && <ShareModel item={shareItem} onClose={()=>setShareItem(null)} isOpen={!!shareItem}/>}
    </div>
  )
}

export default Drive
