import express from 'express'
import cookieParser from 'cookie-parser'
import { PORT } from './config/env.js'
import userrouter from './routes/user.routes.js'
import subscriptionrouter from './routes/subscription.routes.js'
import Authrouter from './routes/auth.routes.js'
import connectTodatabase from './database/mongodb.js'
import errormiddleware from './middlewares/error.middlewares.js'
import path from 'path'
import { fileURLToPath } from "url";
import cors from 'cors'
import arcjetmiddleware from './middlewares/arcject.middlewares.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express()
app.use(
      cors({
    origin: "https://subscription-tracker-28oq.vercel.app/", // or your frontend domain
    credentials: true, // allows cookies
  })
)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/v1/users",userrouter)
app.use("/api/v1/subscriptions",subscriptionrouter)
app.use("/api/v1/auth",Authrouter)

app.use(arcjetmiddleware)
app.use(errormiddleware);
app.get("/",(req,res)=>{
    res.render("subscriptions")
})

connectTodatabase()
app.listen(PORT,()=>{
    console.log(`Server is running on port 3000 on http://localhost:${PORT}`)
})