import express from "express";
import dotenv from "dotenv";
import pool from './db.js';
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});


app.get("/test-db",async (req,res)=>{
    try{
        const result = await pool.query("select count(*) as total from venues");
        console.log("db query reult: \n",result.rows);
        return res
        .status(200)
        .json({
            success: true,
            message: "database connected successfully",
            time: result.rows[0].now
        })
    }
    catch(error){
        console.log("\n error:\n",error);
        return res
        .status(400)
        .json({
            success: false,
            message: "database connection failed",
            error: error.message
        })
    }
})


// Port from environment variables
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});