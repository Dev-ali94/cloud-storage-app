import React, { useEffect, useState } from 'react'
import { CheckIcon, CopyIcon, ExternalLink, Trash2Icon, User2Icon, UserIcon } from "lucide-react"
import { EmptyState } from "../components/ui/EmptyState"
import { Spinner } from "../components/ui/Spinner"
import { copyShareLink, getFileIcon } from "../assets/assets"
import { format } from "date-fns"
import api from "../config/api"
import toast from 'react-hot-toast'
import {ConfirmDialog} from "../components/ui/ConfirmDialog"
const ShareFile = () => {
  const [shares, setShares] = useState([])
  const [isLoading, setIsloading] = useState(false)
  const [deletingShare, setDeletingShare] = useState(null)
  const [isDeleting, setisDeleting] = useState(false)
  const [copiedToken, setCopiedToken] = useState(null)
  const fetchShare = async () => {
    setIsloading(true)
    try {
      const { data } = await api.get("/api/shares")
      setShares(data.share_links || [])

    } catch (error) {
      toast.error('Error while fetching shares')
    } finally {
      setIsloading(false)
    }
  }
  useEffect(() => {
    fetchShare()
  }, [])
  const handleCopy = (token) => {
    copyShareLink(token)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }
  const handleDeleteShare = async () => {
    if (!deletingShare) return
    setisDeleting(true)
    try {
      await api.post(`/api/shares/${deletingShare.id}`)
      toast.success("Share link deleted")
      setShares((prev) => prev.filter((s) => s.id !== deletingShare.id))
      setDeletingShare(null)
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong while deleting share link")
    } finally {
      setisDeleting(false)
    }
  }
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 rounded-xl bg-purple-600/30 text-purple-500 border border-purple-600 '>
          <User2Icon className='size-5' />
        </div>
        <div>
          <h2 className='text-xl font-medium text-zinc-100'>Shared Link</h2>
          <p className='text-sm font-base text-zinc-400'>Share link you have created</p>
        </div>
      </div>
      {isLoading ?
        (
          <div className='py-20 flex justify-center'>
            <Spinner className='size-lg text-purple-600' />
          </div>
        ) : shares.length === 0 ? (
          <EmptyState title="No share Link Yet" description='Link you generate for sharing file and folder will appear here' icon={UserIcon} />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {shares.map((share) => (
              <div key={share.id} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between'>
                <div>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex items-center min-w-0 gap-2.5 pr-2'>
                      {getFileIcon(share.resource?.mime_type)}
                      <h4 className='text-sm font-semibold text-zinc-200 truncate'>{share.resource?.name}</h4>
                    </div>
                    <button onClick={()=>setDeletingShare(share)} className='p-2 rounded-lg text-zinc-200 hover:text-zinc-100 hover:bg-red-500 bg-zinc-800 transition shrink-0 ' title='Delete Share Link'>
                      <Trash2Icon className='size-4' />
                    </button>
                  </div>
                  <div className='text-xs text-zinc-400 space-y-1 mt-3'>
                    <p>Access: <span className='font-medium text-zinc-200'>Anyone with link</span></p>
                    <p>View: <span className='font-medium text-zinc-200'>{share.access_count ?? 0}</span></p>
                    <p>Created_at: <span className='font-medium text-zinc-200'>{format(new Date(share.created_at), "MMM d", "yyyy")}</span></p>

                  </div>
                </div>
                <div className='pt-2 border-t border-zinc-800 flex items-center justify-between gap-2'>
                  <button
                    onClick={() => handleCopy(share.token)}
                    className="inline-flex items-center gap-2 text-xs font-medium
             text-purple-400 hover:text-purple-300
             transition-colors duration-200"
                  >
                    {copiedToken === share.token ? (
                      <>
                        <CheckIcon className="h-5 w-5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-5 w-5 text-zinc-200" />
                        <span className="text-zinc-200 font-semibold">
                          Copy link
                        </span>
                      </>
                    )}
                  </button>
                  <a href={`/s/${share.token}`} target='_blank' rel='noreferrer' className='p-1 rounded-md text-zinc-200 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700' title='Open Public Link'>
                    <ExternalLink className='w-4 h-4 text-zinc-200' />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {deletingShare && (
         <ConfirmDialog
          isOpen={!!deletingShare} 
          onClose={()=>setDeletingShare(null)}
          onConfirm={handleDeleteShare}
          title={`Delete share link for ${deletingShare.resource?.name || "this item"}`}
          description="Anyone who have this no longer to access the share folder or file"
          confirmText='delete text'
          isLoading={isDeleting}
          
         />
        )}
       
    </div>
  )
}

export default ShareFile
