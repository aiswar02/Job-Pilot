require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Failed to start server:", error.message);
    }
};

startServer()