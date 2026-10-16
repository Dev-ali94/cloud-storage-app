import { CloudUploadIcon, DownloadIcon, LockIcon, LucideFolder } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import api from "../config/api"
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { formatBytes, getFileIcon } from '../assets/assets'

const ShareWithMe = () => {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    api.get(`/api/share/access/${token}`).then((res) => {
      setData(res.data)
    }).catch((error) => {
      setError(error.response?.data?.error || "Unable to load share Item")
    }).finally(() => setIsLoading(false))
  }, [token])
  return (
    <div className='min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col'>
      <header className='h-16 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between'>
        <Link to="/">
          <div className="h-16 px-7 flex items-center justify-start border-b border-[var(--border-primary)] ">
            <div className="flex items-center justify-start gap-2">
              <CloudUploadIcon className="w-7 h-7 text-[var(--text-secondary)]" />
              <h1 className="text-sm font-logo text-[var(--title-secondary)] font-base uppercase">Cloudee</h1>
            </div>
          </div>
        </Link>
        <Link className='px-4 py-2 bg-purple-600 rounded-xl hover:bg-zinc-800 hover:text-zinc-100 text-sm font-semibold hover:border hover:border-zinc-700 flex items-center justify-center' to="/login">
          Login
        </Link>
      </header>
      <main>
        {isLoading ? (
          <div className='text-center space-y-3'>
            <Spinner size='lg' className='text-purple-600' />
            <p className='text-sm text-zinc-200 font-medium'>Loading Shared Item.....</p>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center py-20'>
            <div className='max-w-md w-full p-8 bg-zinc-900 border border-zinc-800 rounded-2xl  text-center space-y-4'>
            <div className='size-12 rounded-full bg-red-500/30 text-red-600 flex items-center justify-center mx-auto border border-red-600'>
            <LockIcon className='size-5'/>
            </div>
            <h3>Link Unavilable</h3>
            <p>{error}</p>
            <div className='pt-2'>
              <Link to="/">
              <Button variant='secondary' size="sm">Go TO Home Page</Button>
              </Link>
            </div>
          </div>
          </div>
        ) : data?.resource_type === "file" ? (
         <div className='flex items-center justify-center py-20 '>
           <div className='max-w-xl space-y-2 w-full p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-6animate-fade-in'>
            <div className='w-20 h-20 rounded-3xl bg-zinc-800 border-zinc-700 flex items-center justify-center mx-auto'>
              {getFileIcon(data.file?.mime_type,"size-10")}
            </div>
              <div>
                <h2 className='text-xl font-medium text-zinc-200 mb-1'>{data.file.name}</h2>
                <p className=''>{formatBytes(data.file.size)} Shared By {data.owner?.name}</p>
              </div>
          {data.permission === "download" ? (
            <div className='p-4 rounded-xl bg-zinc-800 border-zinc-700 text-xs text-zinc-400 font-medium'>
              This link grants <span className='text-purple-600 font-semibold'>download only</span> permission
            </div>
            ) :null}
            {data.url && (
              <a href={data.url} download={data.file.name} target='_blank' rel='noreferrer' 
              className='inline-flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-zinc-100 font-semibold text-sm rounded-lg transition'>
                <DownloadIcon className='size-4'/>
                <span>Download File</span>
              </a>
            )}
          </div>
         </div>
        ) : (
          <div className='flex items-center justify-center py-20'>
            <div className='max-w-2xl w-full p-8 bg-zinc-900 border-zinc-800 rounded-3xl space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-xl  bg-purple-600/30 text-purple-600 border border-purple-500'>
                <LucideFolder className='size-5 fill-purple-600'/>
                </div>
                <div>
                  <h2 className='text-md font-semibold text-zinc-100'>{data?.folder?.name}</h2>
                  <p className='text-xs text-zinc-400'>Shared Folder By {data?.owner?.name || "User"}</p>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-xs font-semibold text-zinc-300 uppercase tracking-tight'>Contents</p>
                {!data?.files || data?.files.length === 0 ? (
                  <div className='p-8 text-center bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 font-medium'>
                    This Folder Is Empty
                  </div>
                  ):(
                 <div className='divide-y divide-zinc-900/30 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden'>
                    {data?.files.map((f)=>(
                      <div  key={f.id} className='p-3.5 flex items-center justify-between hover:bg-zinc-900/30 transition'>
                        <div className='flex items-center gap-3 min-w-0 pr-3'>
                          {getFileIcon(f.mime_type,"size-5 shrink-0")}
                          <p className='text-xs font-medium text-zinc-100'>{f.name}</p>
                          <p className='text-xs text-zinc-300'>{formatBytes(f.size)}</p>
                        </div>
                        {f.url && (
                          <a href={f.url} download={f.name} target='_blank' rel='noreferrer' 
                          className='inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-zinc-200 text-xs font-semibold rounded-lg transition shrink-0'>
                            <DownloadIcon className='size-3'/>
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ShareWithMe
