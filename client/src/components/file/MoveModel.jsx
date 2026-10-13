import React, { useEffect, useState } from 'react'
import {useDrive} from "../../hooks/useDrive"
import {Modal} from "../ui/Modal"
import {Button} from "../ui/Button"
import {Input} from "../ui/Input"
import api from "../../config/api"
import { FastForward, HardDriveIcon, HardHatIcon, LucideFolder } from 'lucide-react'
const MoveModel = ({item,isOpen,onClose}) => {
    const [avilabeFolder,setAvilableFolder] = useState([])
    const [selectedfolderId,setSelectedFolderId]=useState(null)
    const [isMoving,setIsmoving] = useState(false)
    const{moveItem}= useDrive()
    useEffect(()=>{
      if(!isOpen) return
      api.get("/api/folders").then(({data})=>{
        const filtered = data.folders.filter((f)=>item?.item_type !== "folder" || f.id !== item.id)
        setAvilableFolder(filtered)
      })
    },[item,isOpen])
    const handleMove = async (e) => {
        if(!item) return
        setIsmoving(true)
        await moveItem(item,selectedfolderId)
        setIsmoving(false)
        onClose()
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Move ${item.name}`}>
      <div className='space-y-4'>
        <p className='text-xs font-medium text-ainc-400'>Select Folder Destination</p>
        <div className='bg-zinc-800 border border-zinc-900 rounded-xl max-w-70 overflow-y-auto divide-y divide-zinc-900 p-1'>
            <button type='button'
            onClick={()=>setSelectedFolderId(null)} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            transition ${selectedfolderId === null ? "bg-purple-600/30 text-purple-500 border border-purple-900 font-semibold" : "text-zinc-200 hover:text-zinc-100"}` }>
                <HardDriveIcon className='size-4 text-purple-600'/>
                <span>My Drive (root)</span>
            </button>
            {avilabeFolder.map((folder)=>(
                <button type='button'
            onClick={()=>setSelectedFolderId(folder.id)} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            transition ${selectedfolderId === folder.id ? "bg-purple-600/30 text-purple-500 border border-purple-900 font-semibold" : "text-zinc-200 hover:text-zinc-100"}` }>
                <LucideFolder className='size-4 text-purple-600'/>
                <span className='truncate'>{folder.name}</span>
            </button>
            ))}
        </div>
         <div className='flex items-center justify-end pt-2 gap-3'>
                       <Button variant='ghost' onClick={onClose} type='button'>
                           cancel
                       </Button>
                        <Button variant='primary'  isLoading={isMoving} onClick={handleMove}>
                           Move
                       </Button>
                    </div>
      </div>
    </Modal>
  )
}

export default MoveModel
