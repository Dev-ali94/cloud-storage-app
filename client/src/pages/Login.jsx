import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { CloudUploadIcon,UserIcon,MailIcon,LockIcon } from "lucide-react"
import {Input} from "../components/ui/Input"
import {Button} from "../components/ui/Button"
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = ({mode="login"}) => {
  const {login,register} = useApp()
  const isRegister = mode === "register"
  const navigate = useNavigate()
  const [form,setForm] = useState({name:"",email:"",password:""})
  const [loading,setLoading] = useState(false)
  const updateField = (key,value)=> setForm((prev)=>({...prev,[key]:value}))
 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  const ok = isRegister
    ? await register(form.name, form.email, form.password)
    : await login(form.email, form.password);

  if (ok) {
    navigate("/");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-zinc-100">
      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
       <div className="flex items-center justify-start gap-2">
         <CloudUploadIcon className="w-9 h-9 text-purple-500"/>
        <h1 className="text-xl font-logo font-medium uppercase">Cloudee</h1>

       </div>
        <div className="my-12 space-y-3">
        <h2 className="text-3xl md:text-3xl lg:text-4xl tracking-tight leading-tight">Secure,Simple & Fast <br/><span className="text-purple-500">Clouade Storage</span></h2>
        <p className="text-sm md:text-base max-w-md leading-relaxed text-zinc-400">Store your files securely in your cloud, organize with folders, share with others and access them from anywhere.</p>
        </div> 
        <div className="text-sm text-zinc-300">© 2023 Cloudee. All rights reserved.</div>
      </div>

       <div className="md:w-1/2 p-8 md:p-12 lg:p-6 flex items-center justify-center">
       <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div>
          <h3 className="text-2xl font-medium text-zinc-100">{isRegister ? "Create an account" : "Welcome back"}</h3>
          <p className="text-sm text-zinc-400 mt-1">{isRegister ? "Join us today and start storing your files securely in the cloud." : "Sign in to access your account and continue where you left off."}</p>
        </div>
        <form className="space-y-4" action="">
          {isRegister && (
            <Input label="Full Name" icon={UserIcon}  placeholder="Enter your full name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required/>
          )}
          <Input type="email" label="Email" icon={MailIcon} placeholder="Enter your email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required/>
          <Input label="Password" icon={LockIcon} type="password" placeholder="*******" value={form.password} onChange={(e) => updateField("password", e.target.value)} required/>
          <Button onClick={handleSubmit} type="submit" variant="primary" className="w-full py-3" isLoading={loading}>
            <span className='font-medium text-base'>
            {isRegister ? "Create Account" : "Sign In"}
            </span>
          </Button>
        </form>
        <div className="text-center pt-1">
          {isRegister ? (
            <p className="text-xs text-zinc-400">
              Already have an account? <Link to="/login" className="text-purple-500 font-bold hover:underline" >Sign in</Link>
            </p>
          ):(
            <p className="text-xs text-zinc-400">
              Don't have an account? <Link to="/register" className="text-purple-500 font-bold hover:underline">Sign up</Link>
            </p>
          )}
        </div>
       </div>
       </div>
    </div>
  )
}

export default Login
