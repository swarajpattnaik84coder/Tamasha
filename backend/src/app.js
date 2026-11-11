import express from "express";
import router from "./routes/authRoutes.js"
import { errorHandler, notFound } from "./middleware/errorHandler.js";


const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use("/api/auth",router)
// Test route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});


app.use(notFound);
app.use(errorHandler);

export default app;
