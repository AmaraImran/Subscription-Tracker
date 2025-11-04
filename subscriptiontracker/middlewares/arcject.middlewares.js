import aj from "../config/arcjeet.js";
const arcjetmiddleware=async(req,res,next)=>{
    try {
        
        const decision=await aj.protect(req,{requested:1});
        if(decision.isDenied){
            if(decision.reason.isRateLimit()) return res.status(429).send("Too Many Requests - Rate limit exceeded");
            if(decision.reason.isBot()) return res.status(403).send("Forbidden - Bot detected");
            return res.status(403).send("Forbidden - Request denied by Arcjet");
        }
        next()
    } catch (error) {
        console.error("Arcjet Middleware Error:", error);
        res.status(500).send("Internal Server Error");
        next(error);
    }
}
export default arcjetmiddleware;