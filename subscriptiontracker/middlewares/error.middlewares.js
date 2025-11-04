const errormiddleware=(err,req,res,next)=>{
try {
    
    let error={...err}
    error.message=err.message
    console.log(err)    
    //bad  
    if(err.name==="CastError"){
        const message=`Resource not found. Invalid: ${err.path}`
        error=new Error(message)
        error.statusCode=400
    } 
    if(err.code===11000){
        const msg=`Duplicate field values`
        error =new error(msg)
        error.statusCode=400
    }
    if(err.name==="ValidationError"){
        const msg=Object.values(err.errors).map((val)=>val.message)
        error=new Error(msg.join(","))
        error.statusCode=400
    }
    res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal server error"
    })
} catch (error) {
    next(error)
}

}
export default errormiddleware