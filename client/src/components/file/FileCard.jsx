import { formatBytes, getFileIcon } from '../../assets/assets'
import { ItemDropdown } from "../ui/ItemDropdown"
import { format } from "date-fns"


const FileCard = ({ file, onClick, onShare,onPreview, onRename, onMove, onDelete }) => {
  return (
    <div
      onClick={() => onClick(file)}
      className='group relative bg-[var(--bg-primary)] border border-[var(--bg-primary)] hover:border-purple-400 rounded-2xl p-4 transition-all duration-300 cursor-pointer flex items-center gap-3'
    >
      {/* File Icon */}
      <div className='p-2.5 rounded-xl bg-purple-400 text-[var(--title-primary)] shrink-0 border border-purple-400'>
        {getFileIcon(file.mime_type, "size-6")}
      </div>

      {/* File Info */}
      <div className='flex-1 min-w-0'>
        <h4
          className='text-sm font-medium text-[var(--desc-color)] truncate group-hover:text-[var(--text-primary)] transition-colors'
          title={file.name}
        >
          {file.name}
        </h4>
        <div className='flex items-center gap-2 text-[11px] text-[var(--title-primary)] mt-1'>
          <span>{formatBytes(file.size)}</span>
          <span className='opacity-50'>•</span>
          <span>{format(new Date(file.created_at), "MMM d, yyyy")}</span>
        </div>
      </div>

      {/* Dropdown Actions */}
      <div
        className='shrink-0'
        onClick={(e) => e.stopPropagation()}
      >
        <ItemDropdown
          item={file}
          onShare={onShare}
          onDelete={onDelete}
          onMove={onMove}
          onRename={onRename}
          onPreview={onPreview}
        />
      </div>
    </div>
  )
}

export default FileCard