import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import pool from "../config/db.js"
const verifyJWT = async (req,res,next)=>{

    const authHeader = req.headers.authorization;



    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new apiError(401, "Unauthorized request");
}

    const token = authHeader.split(" ")[1];


    let decodedToken;
    try{
         decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
    );
    }
    catch(error){
        throw new apiError(401, "Invalid or expired token")
    }


    const result = await pool.query("select user_id, name, email from users where user_id = $1",[decodedToken.user_id])
    const user = result.rows[0];

    if(!user){
        throw new apiError(
            401,
            "invalid access token"
        )
    }

    req.user = user;
    next()
}

export {verifyJWT};