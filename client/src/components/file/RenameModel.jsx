import React, { useEffect, useState } from 'react'
import {useDrive} from '../../hooks/useDrive'
import {Modal} from "../ui/Modal"
import {Input} from "../ui/Input"
import {Button} from "../ui/Button"
const RenameModel = ({item,isOpen,onClose}) => {
    const [name,setName] = useState("")
    const [loading,setLoading] = useState(false)
    const {renameItems } = useDrive()
    useEffect(()=>{
       if(item) setName(item.name || "")
    },[item])
    const handleRename = async (e) => {
        e.preventDefault()
        if(!name.trim() || !item) return
        setLoading(true)
        await renameItems(item,name.trim())
        setLoading(false)
        onClose()
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rename ${item?.item_type === "folder" ? "Folder" : "File"}`}>
        <form className='space-y-4 ' onSubmit={handleRename}>
            <Input value={name} label="name" onChange={(e)=> setName(e.target.value)} autoFocus required/>
            <div className='flex items-center justify-end pt-2 gap-3'>
                <Button variant='ghost' onClick={onClose} type='button'>
                    cancel
                </Button>
                 <Button variant='primary'  isLoading={loading} disabled={!name.trim()} type='submit'>
                    Rename
                </Button>
             </div>
        </form>
      
    </Modal>
  )
}

export default RenameModel
