import bcrypt from "bcrypt"
import pool from "../config/db.js"


const registerUser =async (req,res)=>{
   try {const{name,email,password} = req.body??{};

    if(
        [name,email,password].some(

             (field) => typeof field !== "string" || field.trim() === ""
        )
    ){
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "all fields are required"
            }
        );
    }
    const regexName = /^[A-Za-z ]+$/;
    if(!(regexName.test(name?.trim()))){
        return res
        .status(400)
        .json({
            success: false,
            message: "insert a valid name only of alphabets"
        })
    }
    if(password.length < 8){
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Password must be at least 8 characters long"
            }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!(emailRegex.test(email))){
        return res
        .status(400)
        .json({
            success: false,
            message: "not an email"
        })
    }

    const hash = await bcrypt.hash(password,10);
    const user = await pool.query('insert into users( name,email,password_hash) values($1,$2,$3) returning user_id,name,email',[name,email,hash])

         return res
    .status(201)
        .json(
            {
                success: true,
                message: "user created successfuly",
                data: user.rows[0]
            }
        );
    
}catch(error){
    if(error.code === "23505"){
        console.log("email exist error:", error);
        return res
        .status(409)
        .json({
            success: false,
            message: "email already registered"
        });
    }
    console.log("register error: ",error);
    return res.status(500).json({
        success: false,
        message: "Something went wrong"
    });

}
};

export {registerUser}