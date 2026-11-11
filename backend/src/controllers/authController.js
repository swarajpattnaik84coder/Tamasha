import bcrypt from "bcrypt"
import pool from "../config/db.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";


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

const loginUser = async (req,res)=>{
    const {email,password}  = req.body ?? {};

    if(
        [email,password].some(

             (field) => typeof field !== "string" || field.trim() === ""
        )
    ){
        throw new apiError(
            400,
            "all fields are required"
        );
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

    
    const result = await pool.query("select * from users where email = $1",[email]);
    const user = result.rows[0];


    const isPasswordCorrect = user ? await bcrypt.compare(password, user.password_hash) : false;

    if(!isPasswordCorrect || !user){
        throw new apiError(401,"invalid email or password");
    }

    const token = jwt.sign(
        {user_id: user.user_id},
       process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    )

    return res
    .status(201)
    .json(
        new apiResponse(
            201,
            {  user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email
            },token},
            "User loged in successfully"

        )
    )

}
export {registerUser,
    loginUser
}