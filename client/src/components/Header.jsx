import React from 'react'
import {useApp} from "../context/AppContext"
import { ArrowUpDownIcon, MenuIcon, SearchIcon } from 'lucide-react'
import {Dropdown, DropdownItem} from "./ui/Dropdown"
import {SORT_OPTIONS} from "../assets/assets"
const Header = ({onMobileMenuToggle}) => {
    const {user,sortBy,setSortBy,searchQuery,setSearchQuery,logout} = useApp()
  return (
    <header className='sticky top-4 z-30 h-16 px-4 md:px-6 flex items-center justify-center gap-3'>
      <div className='flex items-center flex-1 max-w-xl gap-3 '>
        <button className='p-2 rounded-xl text-zinc-200 hover:text-zinc-100 hover:bg-zinc-800 md:hidden'>
            <MenuIcon className='size-5'/>
        </button>
        <div className='relative flex-1'>
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-300 '>
                <SearchIcon className='size-5'/>
            </div>
            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} 
            placeholder='Search file and folder......'  className='w-full bg-zinc-900 border border-zinc-800
             focus:border-purple-600 focus:ring-1 focus:ring-purple-600  rounded-full text-sm text-zinc-200 placeholder-zinc-300 pl-10 pr-4 py-2 transtion outline-none'/>
            {searchQuery && (
                <button onClick={()=>setSearchQuery("")} className='absolute inset-y-0 right-2 pr-3 flex items-center text-xs text-zinc-300 hover:text-red-500 font-medium'>Clear</button>
            )}
        </div>
        <div className='flex items-center gap-2'>
            <Dropdown 
            trigger={
                <button className='flex items-center gap-1.5 py-2 px-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300   rounded-full transition'>
                    <ArrowUpDownIcon className='w-4 h-4'/>
                </button>
            }
            >
                {SORT_OPTIONS.map((opt)=>(
                      <DropdownItem key={opt.value} onClick={()=>setSortBy(opt.value)}>
                        <span className={sortBy === opt.value ? "text-purple-600 font-semibold":""}>{opt.label}</span>
                      </DropdownItem>
                ))}

            </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Header