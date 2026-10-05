import {useState,useEffect,createContext,useContext} from "react"
import {toast} from "react-hot-toast"


const AppContext = createContext()
const errorMsg = (err,fallBack)=> err.response?.data?.msg || fallBack || "Something went wrong"
export const AppProvider = ({children})=>{
    const [user,setUser] = useState(null)
    const value = {}
    const authAction = async(requestFn,successMsg,errorFallBack) =>{
      try{
       const {data} = await requestFn()
        setUser(data.user) 
        if(successMsg) toast.success(successMsg)
            return true
      }catch(error){
        toast.error(errorMsg(error,errorFallBack))
      }
    }
    return<AppContext.Provider valure={value}>
    {children}
    </AppContext.Provider>
}

export const useApp = ()=> useContext(AppContext)