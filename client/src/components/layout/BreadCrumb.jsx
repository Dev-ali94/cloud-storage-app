import React from 'react'
import { useApp } from '../../context/AppContext'
import { ChevronRightIcon, HardDriveIcon} from 'lucide-react'
import {Link} from "react-router-dom"
const BreadCrumb = () => {
    const {breadcrumb} = useApp()
  return (
    <div className='flex items-center  gap-1 text-sm text-[var(--text-primary)] py-3 overflow-x-auto no-scrollbar'>
        {breadcrumb.map((item,index)=>{
           const isLast = index === breadcrumb.length - 1
           const path = item.id ? `/drive/${item.id}`:"/"
           return(
            <React.Fragment key={item.id || "root"}>
              {index > 0  && <ChevronRightIcon className='size-4 text-[var(--desc-color)] shrink-0'/>}
              <Link to={path} className={`flex items-center gap-2 px-3 py-1 rounded-lg transition shrink-0 
                ${isLast ? "text-[var(--text-secondary)] font-medium bg-[var(--bg-primary)] border border-[var(--border-primary)]": "hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"}`}>{index === 0 && <HardDriveIcon className='size-4 text-[var(--bg-btn-secondary)]'/>}</Link>
                <span>{item.name}</span>
            </React.Fragment>
           )
        })}  
    </div>
  )
}

export default BreadCrumb
