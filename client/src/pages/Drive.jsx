import React,{useEffect, useState} from 'react'
import BreadCrumb from '../components/layout/BreadCrumb'
import FileGrid from '../components/file/FileGrid'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {useDrive} from "../hooks/useDrive"
import FilePreview from '../components/file/FilePreview'
import ShareModel from '../components/file/ShareModel'
import RenameModel from "../components/file/RenameModel"
import MoveModel from '../components/file/MoveModel'
import {ConfirmDialog} from "../components/ui/ConfirmDialog"
const Drive = () => {
  const navigate = useNavigate()
  const {folderId} = useParams()
  const {fetchDriveContent,setCurrentFolderId} = useApp()
  const {removeDriveItem} = useDrive()
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
const handelConformDelete = async () => {
  if(!deleteItem) return
  await removeDriveItem(deleteItem)
  setDeleteItem(null)
}
  return (
    <div className="" >
      <BreadCrumb/>
      <FileGrid onFolderClick={(folder)=> navigate(`/drive/${folder.id}`)} onPreviewFile={setPreviewFile} onShareItem={setShareItem} onMoveItem={setMoveItem} onDeleteItem={setDeleteItem} onRenameItem={setRenameItem} />
        {previewFile && <FilePreview file={previewFile} onClose={()=> setPreviewFile(null)}/>}
        {shareItem && <ShareModel item={shareItem} onClose={()=>setShareItem(null)} isOpen={!!shareItem}/>}
        {renameItem && <RenameModel item={renameItem} onClose={()=>setRenameItem(null)} isOpen={!!renameItem}/>}
        {moveItem && <MoveModel item={moveItem} onClose={()=>setMoveItem(null)} isOpen={!!moveItem}/>}
        {deleteItem && <ConfirmDialog isOpen={!!deleteItem} onClose={()=>setDeleteItem(null)} onConfirm={handelConformDelete} title={`Move ${deleteItem.name} to trash`} message='You can restore this item any time from the trash' confirmText='Move to Trash'/>}
    </div>
  )
}

export default Drive
