const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs").promises;

const app = express();
const port = 3000;

const User = require('./models/user');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/regForm').then(() => {
    console.log("Database connected!");
}).catch((err) => {
    console.error("Database connection error:", err);
});

app.post("/", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            const alertHtml = await fs.readFile("public/alert.html", "utf-8");
            return res.send(alertHtml);
        }

        const userData = new User(req.body);
        await userData.save();
        const submitHtml = await fs.readFile("public/submit.html", "utf-8");
        res.send(submitHtml);
    } catch (err) {
        console.error("Error processing registration:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", async (req, res) => {
    try {
        const htmlContent = await fs.readFile("public/index.html", "utf-8");
        res.send(htmlContent);
    } catch (err) {
        console.error("Error serving index:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log("App listening on port:", port);
});
