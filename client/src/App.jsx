import React from 'react'
import { Toaster } from "react-hot-toast"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Drive from "./pages/Drive"
import ShareFile from "./pages/ShareFile"
import ShareWithMe from "./pages/ShareWithMe"
import Trash from "./pages/Trash"
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'


const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
         <Route path="/s/:token" element={<ShareWithMe/>}/>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Drive />} />
            <Route path="/:folderId" element={<Drive />} />
            <Route path='/shared' element={<ShareFile/>}/>
            <Route path="/trash" element={<Trash/>}/>
          </Route>
        </Route>
        <Route path="*" element={<Navigate />} />
      </Routes>
    </>
  )
}

export default App
