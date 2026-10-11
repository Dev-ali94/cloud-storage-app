import { LucideFolder } from 'lucide-react'
import {ItemDropdown} from "../ui/ItemDropdown"

const FolderCard = ({folder,onClick,onShare,onRename,onMove,onDelete}) => {
  return (
    <div onClick={()=>onClick(folder)} className='group relative bg-[var(--bg-primary)] border border-[var(--bg-primary)] hover:border-purple-400 rounded-2xl p-4 transition-all duration-300 cursor-pointer flex items-center justify-between'>
       <div className='flex items-center gap-3 min-w-0 pr-2'>
          <div className='p-2.5 rounded-xl bg-purple-400 text-[var(--title-primary)] shrink-0 border border-purple-400'>
            <LucideFolder className='size-6 fill-purple-500/20'/>
          </div>
          <h4 className='text-sm font-medium text-[var(--desc-color)] truncate group-hover:text-[var(--text-primary)] transition-colors' title={folder.name}>{folder.name}</h4>
       </div>
        <ItemDropdown item={folder} onShare={onShare} onDelete={onDelete} onMove={onMove} onRename={onRename}/>
    </div>
  )
}

export default FolderCard
