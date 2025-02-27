const express = require("express");
const app = express();
const { connect } = require("./config/Database");
const userRoutes = require("./routes/User");
const oppoRoutes = require("./routes/Opportunity");
const teamRoutes = require("./routes/Team");

const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.use("/hackops/v1/user", userRoutes);
app.use("/hackops/v1/opportunity", oppoRoutes);
app.use("/hackops/v1/team", teamRoutes);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

const start = async () => {
    try {
        await connect(MONGO_URL);
        cloudinaryConnect();
        app.listen(PORT, () => {
            console.log("Server is listening at " + PORT);
        });
    } catch (error) {
        console.error("Error starting the server:", error.message);
    }
};

start();
