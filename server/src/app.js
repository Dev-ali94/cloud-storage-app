import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import cookieParser from "cookie-parser"
import { initDb } from './config/db.js';
import authRoute from './routes/authRoutes.js';
import folderRoute from './routes/folderRoutes.js';
import fileRoute from './routes/fileRoutes.js';
import { protect } from './middlewares/auth.js';
dotenv.config();
const app = express();

const allowedOrigins = process.env.ORIGIN.split(",")
app.use(cors({origin:allowedOrigins,credentials:true}))
app.use(cookieParser())
app.use(express.json({limit:"100mb"}))

app.use((err,_req,res,_next)=>{
  res.status(err.status || 500).json({error:err.message || "Some thing went wrong"})
})
app.use("/api/auth",authRoute)
app.use("/api/folders",protect,folderRoute)
app.use("/api/files",protect,fileRoute)
initDb().then(()=>{
  app.get('/', (req, res) => {
    res.send('This server is now live and running!');
  });
})

export default app
