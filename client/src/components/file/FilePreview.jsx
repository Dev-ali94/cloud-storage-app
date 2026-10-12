import React, { useEffect, useState } from 'react'
import api  from "../../config/api"
import { DownloadIcon, FileTextIcon, Loader2Icon, XIcon } from 'lucide-react'
import { formatBytes } from '../../assets/assets'
const FilePreview = ({ file, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (!file) return
    let isMounted = true
    setIsLoading(true)
    setError(null)
    api.get(`/api/files/${file.id}/preview`)
      .then(({ data }) => {
        if (isMounted) setPreviewUrl(data.url)
      })
      .catch(() => {
        if (isMounted) setError("Filed to preview that file")
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [file])
  if(!file) return null
  const mime = file.mime_type || ""

  return (
    <div onClick={onClose} className='fixed inset-0 z-50 flex items-center justify-center  p-4 bg-[#0A0A0A]/30 backdrop-blur-sm animate-fade-in'>
       <div onClick={(e)=>e.stopPropagation()} className='w-full max-w-4xl bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-2xl flex flex-col max-h-[94vh] overflow-hidden animate-slide-up'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]'>
          <div className='flex items-center gap-3 min-w-0 pr-0'>
            <FileTextIcon className='size-5 text-[var(--text-primary)] shrink-0'/>
            <div>
              <h2 className='text-base font-medium text-[var(--title-primary)] truncate'>{file.name}</h2>
              <p className='text-xs text-[var(--desc-color)]'>{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
             {previewUrl && (
              <a
              href={previewUrl}
              download={file.name}
              target='_blank'
              rel="noreferrer"
              className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-btn-primary)] hover:bg-purple-700 text-white text-xs font-medium rounded-md transition'
              >
                <DownloadIcon className='w-4 h-4'/>
                <span>Download</span>
              </a>
             )}
             <button onClick={onClose} className='p-2 rounded-lg text-[var(--title-secondary)] hover:text-white bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]'>
             <XIcon className='size-5'/>
             </button>
          </div>
        </div>
        <div className='flex-1 p-6 overflow-auto flex items-center justify-center min-h-80'>
          {isLoading ? (
            <div className='flex flex-col items-center gap-3 text-[var(--desc-color)]'>
              <Loader2Icon className='h-4 w-4 animate-spin text-[var(--text-primary)]'/>
              <h2 className='text-sm font-medium'>Loading......</h2>
            </div>
          ):error ? (
          <div className='text-red-600 p-4 text-center'>
            <p>{error}</p>
          </div>
          ):mime.startsWith("image/")?(
            <img src={previewUrl} alt={file.name} className='max-h-[70vh] max-w-full object-contain rounded-xl border border-[var(--border-primary)]'/>
          ):mime.startsWith("video/") ? (
            <video src={previewUrl} controls className="max-h-[70vh] max-w-full object-contain rounded-xl border border-[var(--border-primary)]"/>
          ):mime.startsWith("audio/")?(
            <div className='p-8 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-2xl flex flex-col items-center gap-2'>
              <h2 className='text-sm font-semibold text-[var(--title-primary)]'>{file.name}</h2>
              <audio src={previewUrl} controls className='w-72 md:w-96'/>
            </div>
          ):mime === "application/pdf" ? (
            <iframe
            title={file.name}
             src={previewUrl} className='w-full h-[70vh] rounded-xl border border-[var(--border-primary)] ' />
          ):(
            <div className='text-center p-10 bg-zinc-800 border rounded-2xl max-w-sm border-[var(--border-secondary)] '>
              <FileTextIcon className='size-12 text-[var(--desc-color)] mx-auto mb-3'/>
              <p className='text-sm text-zinc-300 mb-1'>NO Dreict Preview Avilable</p>
            </div>
          )
          }
        </div>
       </div>
    </div>
  )
}

export default FilePreview
