import React from 'react'
import {useApp} from "../context/AppContext"
import { ArrowUpDownIcon, MenuIcon, SearchIcon } from 'lucide-react'
import {Dropdown, DropdownItem} from "./ui/Dropdown"
import {SORT_OPTIONS} from "../assets/assets"
const Header = ({onMobileMenuToggle}) => {
    const {user,sortBy,setSortBy,searchQuery,setSearchQuery,logout} = useApp()
  return (
    <header className='sticky top-0 z-30 h-16 bg-zinc-900 backdrop-blur-md border-b border-zinc-700  px-4 md:px-6 flex items-center justify-center gap-3'>
      <div className='flex items-center flex-1 max-w-xl gap-3 '>
        <button className='p-2 rounded-xl text-zinc-200 hover:text-zinc-100 hover:bg-zinc-700 md:hidden'>
            <MenuIcon className='size-5'/>
        </button>
        <div className='relative flex-1'>
            <div className='absolute inset-y-0 left-2 pl-3.5 flex items-center pointer-events-none text-zinc-400 '>
                <SearchIcon className='size-5'/>
            </div>
            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} 
            placeholder='Search file and folder......'  className='w-full bg-zinc-800 border border-zinc-700 
            focus:bg-zinc-700 focus:border-purple-600 focus:ring-1 focus:ring-purple-600  rounded-full text-xs text-zinc-200 placeholder-zinc-100 pl-10 pr-4 py-2 transtion outline-none'/>
            {searchQuery && (
                <button onClick={()=>setSearchQuery("")} className='absolute inset-y-0 right-2 pr-3 flex items-center text-xs text-zinc-400 hover:text-zinc-100 font-medium'>Clear</button>
            )}
        </div>
        <div className='flex items-center gap-2'>
            <Dropdown 
            trigger={
                <button className='flex items-center gap-1.5 py-2 px-3 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition'>
                    <ArrowUpDownIcon className='w-3.5 h-3.5 text-zinc-100'/>
                    <span  className='hidden sm:inline'>sort</span>
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