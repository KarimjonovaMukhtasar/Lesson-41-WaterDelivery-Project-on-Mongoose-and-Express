import {config} from "../config/index.js"
import { verifyToken } from "../helper/jwt.js"

export const authGuard = (req,res,next) =>{
    try{
        const authHeader = req.headers["authorization"]
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: `UNAUTHORIZED`})
        }
        const token = authHeader.split(" ")[1]
        const validToken = verifyToken(token, config.jwt.accessSecret)
        req.user = validToken
        next()
    }catch(e){
        return res.status(403).json({message:`INVALID TOKEN`, e})
    }
}
