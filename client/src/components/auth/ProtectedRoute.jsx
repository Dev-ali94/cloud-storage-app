import React, { Children } from 'react'
import { useApp } from '../../context/AppContext'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '../ui/Spinner'

const ProtectedRoute = ({children}) => {
    const {isAuthenticated,isLoading} = useApp()
    const location = useLocation()
    if (isLoading) {
        return(
            <div className='min-h-screen flex flex-col items-center justify-center gap-3'>
                <Spinner size='lg' className='text-purple-600'/>
                <p className='text-sm text-zinc-200 font-medium'>Drive Loading....</p>
            </div>
        )
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from:location}} replace/>
    }
  return children ? <>{children}</> : <Outlet/>
}

export default ProtectedRoute
