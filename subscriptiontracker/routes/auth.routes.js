import {Router} from 'express'
import { SignIn,signUp } from '../controllers/auth.controller.js'
const Authrouter=Router()
Authrouter.post("/sign-up",signUp)
Authrouter.post("/sign-in",SignIn)

export default Authrouter