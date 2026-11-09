import express from "express";
import pool from './config/db.js';
import router from "./routes/authRoutes.js"


const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use("/api/auth",router)
// Test route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});


app.get("/test-db",async (req,res)=>{
    try{
        const result = await pool.query("select count(*) as total from venues");
        console.log("db query result: \n",result.rows);
        return res
        .status(200)
        .json({
            success: true,
            message: "database connected successfully",
            venueCount: Number(result.rows[0].total)
        })
    }
    catch(error){
        console.log("\n error:\n",error);
        return res
        .status(500)
        .json({
            success: false,
            message: "database connection failed",
            error: error.message
        })
    }
})

export default app;