import dotenv from "dotenv";
import app from './app.js'
dotenv.config();

// Port from environment variables
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});