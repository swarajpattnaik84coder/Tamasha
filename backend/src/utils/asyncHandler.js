const asyncHandler = (requestHandler)=>{

    const middleware = async (req,res,next)=>{
        try{
            await requestHandler(req,res,next);
        }catch(error){
            next(error);
    }
    };
    return middleware;
}

export {asyncHandler}
