import React, { useCallback, useEffect, useState } from 'react'
import {Modal} from "../ui/Modal"
import { CheckIcon, CopyIcon, Loader2Icon, XIcon } from 'lucide-react'
import {Button} from "../ui/Button"
import {Input} from "../ui/Input"
import api from "../../config/api"
import toast from 'react-hot-toast'
const ShareModel = ({item,isOpen,onClose}) => {
  const [copied,setCopied] = useState(false)
  const [isLoading,setisLoading] = useState(false)
  const [generatedLink,setGeneratedLink] = useState(null)
  const [sharedLinkId,setShareLinkId] = useState(null)
  
  const getOrCreateShareLink = useCallback(async (params) => {
     if(!item) return
     setisLoading(true)
     try {
      const {data} = await api.post("/api/share/create",{resource_type:item.item_type === "folder" ? "folder" : "file",resource_id:item.id,permission:"download"})
      const link = data.share_link
      if (link?.token) {
        const fullUrl = `${window.location.origin}/s/${link.token}`
        setGeneratedLink(fullUrl)
        setShareLinkId(link.id)
      }
     } catch (error) {
      toast.error(error.response?.data?.error || "Error generating share link")
     }finally{
      setisLoading(false)
     }
  },[item])
  useEffect(()=>{
    if (isOpen && item) {
      setCopied(false)
      setGeneratedLink("")
      setGeneratedLink(null)
      getOrCreateShareLink()
    }

  },[item,isOpen,getOrCreateShareLink])

  const copyToClipboard = async (params) => {
    if(!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    toast.success("Share Url Copied to ClipBoard")
    setTimeout(()=>setCopied(false),2000)
  }
  const handleDeleteShareLinked = async (params) => {
    if(!sharedLinkId) return
    try {
      await api.post(`/api/shares/${sharedLinkId}`)
      toast.success("Share Link Deleted")
      setGeneratedLink("")
      setShareLinkId(null)
      onClose()
    } catch (error) {
       toast.error(error.response?.data?.error || "Error deleting share link")
    }
  }
  return (

    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${item.name}"`}>
       <div className='space-y-4'>
        <div className='flex items-center gap-3 rounded-xl p-3 bg-purple-200/30'>
           <div>
          <h2 className='text-xs text-zinc-200 font-medium'>Anyone with this link</h2>
          <p className='text-[11px] text-zinc-400'>can view and download {item?.item_type === "folder" ? "folder" : "file"} </p>
        </div>
        </div>
        {isLoading ? (
          <div  className='py-6 flexx items-center justify-center gap-2 text-zinc-200'>
            <Loader2Icon className='size-5 animate-spin text-purple-500'/>
            <span className='text-xs font-medium'>Generate Share Link......</span>
          </div>
          ) : generatedLink ? (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='block text-xs font-medium text-zinc-200'>Shareable Link</label>
              <div className='flex items-center gap-2'>
                 <Input value={generatedLink} readOnly className="bg-zinc-900 text-xs text-zinc-300 select-all"/>
                 <Button variant='primary' className='shrink-0' onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckIcon className='size-4'/>
                        <span>Copied</span>
                    </>
                ):(
                  <>
                  <CopyIcon className='size-4'/>
                  <span>Copy</span>
                  </>
                )}
                 </Button>
              </div>
            </div>
            <div className='pt-2 border-t border-zinc-800 text-zinc-400 flex items-center justify-end gap-3'>
              <span>Want to revoke acccess?</span>
              <XIcon onClick={handleDeleteShareLinked} className='size-4 hover:text-red-500 text-zinc-200  cursor-pointer'/>

            </div>
          </div>
          ) : (
            <div className='spzce-y-4 text-center'>
          <Button variant='primary' onClick={getOrCreateShareLink} isLoading={isLoading}>
            Generate Share Link
          </Button>
            </div>
          )}
       </div>
    </Modal>
  )
}

export default ShareModel
