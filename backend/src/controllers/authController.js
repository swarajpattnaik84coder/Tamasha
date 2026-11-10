import bcrypt from "bcrypt"
import pool from "../config/db.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";


const registerUser = async (req,res)=>{
  const{name,email,password} = req.body??{};

    if(
        [name,email,password].some(

             (field) => typeof field !== "string" || field.trim() === ""
        )
    ){
        throw new apiError(
            400,
            "all fields are required"
        );
    }
    const regexName = /^[A-Za-z ]+$/;
    if(!(regexName.test(name?.trim()))){

            throw new apiError(
            400,
            "insert a valid name only of alphabets")

    }
    if(password.length < 8){

           throw new apiError(
                400,
                "Password must be at least 8 characters long"
            )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!(emailRegex.test(email))){
 
            
           throw new apiError(
                400,
                "not an email"
            )
    }

    const hash = await bcrypt.hash(password,10);
    const user = await pool.query('insert into users( name,email,password_hash) values($1,$2,$3) returning user_id,name,email',[name,email,hash])

         return res
        .status(201)
        .json(
                new apiResponse(
                    201,
                    user.rows[0],
                    "user created successfuly",
                )
        );
    }

export {registerUser}