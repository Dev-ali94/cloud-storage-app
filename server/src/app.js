import folderRoute from './routes/folderRoutes.js';
import shareRoute from './routes/shareRoutes.js';
import { protect } from './middlewares/auth.js';
import trashRoute from './routes/trashRoute.js';
import authRoute from './routes/authRoutes.js';
import fileRoute from './routes/fileRoutes.js';
import cookieParser from "cookie-parser"
import { initDb } from './config/db.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"

// middelwares
dotenv.config();
const app = express();
const allowedOrigins = process.env.ORIGIN.split(",")
app.use(cors({origin:allowedOrigins,credentials:true}))
app.use(cookieParser())
app.use(express.json({limit:"100mb"}))

// for error handling
app.use((err,_req,res,_next)=>{
  res.status(err.status || 500).json({error:err.message || "Some thing went wrong"})
})

// my all app routes
app.use("/api/auth",authRoute)
app.use("/api/folders",protect,folderRoute)
app.use("/api/files",protect,fileRoute)
app.use("/api/trash",protect,trashRoute)
app.use("/api/share",shareRoute)

// my server route with connection of db
initDb().then(()=>{
  app.get('/', (req, res) => {
    res.send('This server is now live and running!');
  });
})

export default app
