import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { toast } from "react-hot-toast"
import api from "../config/api"


const AppContext = createContext()
const ROOT_BREADCRUMB = [{ id: null, name: "My Drive" }]
const errorMsg = (err, fallBack) => err.response?.data?.msg || fallBack || "Something went wrong"
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [breadcrumb, setBreadCrumb] = useState(ROOT_BREADCRUMB)
  const [folder, setFolder] = useState([])
  const [file, setFile] = useState([])
  const [isDriveLoading, setIsDriveLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("asc_order")


  const authAction = async (requestFn, successMsg, errorFallBack) => {
    try {
      const { data } = await requestFn();

      setUser(data.user);

      if (successMsg) {
        toast.success(successMsg);
      }

      return true;
    } catch (error) {
      toast.error(errorMsg(error, errorFallBack));
      return false;
    }
  };
  const refreshUser =  useCallback(async()=>{
    try {
      const {data} = await api.get("/api/auth/me")
      setUser(data.user)
      return data.user    
    } catch (error) {
      setUser(null)
      return null      
    }
  },[])
  useEffect(()=>{
refreshUser().finally(()=>setIsLoading(false))
  },[refreshUser])
  const login = async (email, password) => {
    return authAction(() => api.post("/api/auth/login", { email, password }), "Welcome Back", "Login Failed")
  }
  const register = async (email, password, name) => {
    return authAction(() => api.post("/api/auth/register", { email, password, name }), "Welcome", "Login to register")
  }
  const logout = async (email, password) => {
    try {
      await api.post("/api/auth/logout")
      setUser(null)
      toast.success("Logout SucessFully")
    } catch (error) {
      toast.error("Logout Error")
    }
  }
  const value = { user, setUser, login, logout, register,isAuthenticated:!!user,isLoading }
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}

export const useApp = () => useContext(AppContext)