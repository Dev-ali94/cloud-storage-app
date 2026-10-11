import React from 'react'
import { useApp } from '../../context/AppContext'
import {Spinner} from "../ui/Spinner"
import {EmptyState} from "../ui/EmptyState"
import FolderCard from '../folder/FolderCard'
import FileCard from './FileCard'
const FileGrid = ({onFolderClick,onPreviewFile,onShareItem,onMoveItem,onRenameItem,onDeleteItem}) => {
  const {folder,file,isDriveLoading} = useApp()
  
  if (isDriveLoading) {
    return(
        <div className='py-20 flex flex-col items-center justify-center gap-3 text-[var(--title-primary)]'>
            <Spinner size='lg' className='text-[var(--text-primary)]'/>
            <span className='text-sm font-semibold'>Loading items....</span>
        </div>
    )
  }
  const hasFolder = folder && folder.length > 0 
  const hasFile = file && file.length > 0
  if (!hasFile && !hasFolder) {
    return(
        <EmptyState/>
    )
  }
    return (
    <div className='space-y-6'>
      {hasFolder && (
        <div> 
            <h3 className='text-xs font-semibold text-[var(--title-primary)] uppercase -tracking-wider mb-3'>Folders</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {folder.map((folder)=>(
                     <FolderCard key={folder.id} folder={folder} 
                     onClick={onFolderClick}
                     onShare={(item)=> onShareItem({...item,item_tpe:"folder"})}
                     onRename={(item)=> onRenameItem({...item,item_tpe:"folder"})}
                     onMove={(item)=> onMoveItem({...item,item_tpe:"folder"})}
                     onDelete={(item)=> onDeleteItem({...item,item_tpe:"folder"})}
                     />
                ))}
            </div>
        </div>
      )}
      {hasFile && (
        <div> 
            <h3 className='text-xs font-semibold text-[var(--title-primary)] uppercase -tracking-wider mb-3'>Files</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {file.map((file)=>(
                     <FileCard key={file.id} file={file}
                     onPreviewFile={onPreviewFile}
                     onShare={(item)=> onShareItem({...item,item_tpe:"file"})}
                     onRename={(item)=> onRenameItem({...item,item_tpe:"file"})}
                     onMove={(item)=> onMoveItem({...item,item_tpe:"file"})}
                     onDelete={(item)=> onDeleteItem({...item,item_tpe:"file"})}
                     />
                ))}
            </div>
        </div>
      )}
    </div>
  )
}

export default FileGrid
