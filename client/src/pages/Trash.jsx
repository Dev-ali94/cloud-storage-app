import React, { useEffect, useState } from 'react'
import { LucideFolder, Trash2Icon,RotateCcwClock, TrashIcon } from "lucide-react"
import { useDrive } from '../hooks/useDrive'
import { useApp } from '../context/AppContext'
import api from '../config/api'
import toast from 'react-hot-toast'
import { Button } from "../components/ui/Button"
import { EmptyState } from "../components/ui/EmptyState"
import { Spinner } from '../components/ui/Spinner'
import { formatBytes, getFileIcon } from '../assets/assets'
import {ConfirmDialog} from "../components/ui/ConfirmDialog"
function TrashItemCard({item,isFolder,onRestore,onDelete}) {
  return(
    <div className='bg-zinc-900 border-zinc-800 rounded-2xl p-4 flex items-center justify-between'>
      <div className='flex items-center gap-3 min-w-0 pr-2 '>
        {isFolder ? <LucideFolder className='size-5 text-purple-600 shrink-0'/>:getFileIcon(item.mime_type)}
        <div className='min-w-0'>
          <p className='text-sm font-medium text-zinc-200 truncate'>{item.name}</p>
          <p className='text-xs font-semibold text-zinc-400'>{formatBytes(item.size)}</p>
        </div>
      </div>
      <div className='flex items-center gap-1 shrink-0'>
        <button className='p-2 rounded-lg text-zinc-200 hover:text-emerald-400 hover:bg-emerald-500/30' title='restore' onClick={()=>onRestore(item)}>
        <RotateCcwClock className='size-5'/>
        </button>
        <button className='p-2 rounded-lg text-red-500 hover:text-red-400   hover:bg-red-500/30' title='restore' onClick={()=>onDelete(item)}>
        <TrashIcon className='size-5'/>
        </button>
      </div>
    </div>
  )
}
const Trash = () => {
  const [{ files, folders }, setTrash] = useState({ files: [], folders: [] })
  const [loading, setLoading] = useState(false)
  const [isEmptying, setIsEmptying] = useState(false)
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
  const { restoreItem, permenantDeleteItem } = useDrive()
  const { refreshUser } = useApp()
  const fetchTrash = async (params) => {
    setLoading(true)
    try {
      const { data } = await api.get("/api/trash")
      setTrash({ files: data?.files || [], folders: data?.folders || [] })
    } catch (error) {
      toast.error("Error while fetching Trash")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchTrash()
  }, [])
  const hasItem = files.length > 0 || folders.length > 0
  const handleEmptyTrash = async (params) => {
    setIsEmptying(true)
    try {
      await api.delete("/api/trash/empty")
      toast.success("Trash Empty")
      setTrash({files:[],folders:[]})
      await refreshUser()
    } catch (error) {
      toast.error("Error While Empty Trash")
    }finally{
      setIsEmptying(false)
      setShowEmptyConfirm(false)
    }
  }
  const handleAction = async (actionFn,item,isFolder)=>{
    const ok = await actionFn({id:item.id,item_type:isFolder?"Folder":"File"})
    if (ok) {
      setTrash((prev)=> (
        {
          files:isFolder ? prev.files : prev.files.filter((f)=>f.id !== item.id),
          folders:isFolder ? prev.folders.filter((f)=>f.id !== item.id) : prev.folders
        }
      ))
    }
  }
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-lg bg-red-500/30 text-red-600 border border-red-800'>
            <Trash2Icon className='size-5' />
          </div>
          <div>
            <h2 className='text-xl font-medium text-zinc-100'>Trash</h2>
            <p className='text-xs text-zinc-200'>Item in trash are soft deleted</p>
          </div>
        </div>
        {hasItem && (
          <Button variant='danger' className='px-4 py-2.5 font-semibold text-sm' size="sm" icon={Trash2Icon} onClick={() => setShowEmptyConfirm(true)} >
            Empty Trash
          </Button>
        )}
      </div>
      {loading ? (
        <div className='text-center space-y-3'>
          <Spinner size='lg' className='text-purple-600' />
          <p className='text-sm text-zinc-200 font-medium'>Loading Shared Item.....</p>
        </div>
      ) : !hasItem ? (
        <EmptyState title='Trash is empty' description='Items you delete will show up here before being permanently removed' icon={Trash2Icon}/>
      ) : (
        <div className='space-y-6'>
          {[
            {title:"Folders",items:folders,isFolder:true },
            {title:"Files",items:files,isFile:true }
          ].filter(({items})=> items.length > 0)
          .map(({title,items,isFolder})=>(
            <div key={title} >
              <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3'>{title}</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 '>
                {items.map((item)=>(
                <TrashItemCard item={item} isFolder={isFolder} onRestore={(it)=>handleAction(restoreItem,it,isFolder)} onDelete={(it)=> handleAction(permenantDeleteItem,it,isFolder)} />
              ))}
              </div>
            </div>
          ))
          }
          <ConfirmDialog isOpen={showEmptyConfirm} onClose={()=>showEmptyConfirm(false)} onConfirm={handleEmptyTrash} title='Empty Trash' message='All item in the trash permenatly deleted.This action cannot be undo'confirmText='Empty Trash' isLoading={isEmptying}/>
        </div>
      )}
    </div>
  )
}

export default Trash
