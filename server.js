const express = require('express');
const app = express();
const connectDB = require('./db/dbConnection');
const User = require('./db/user');
const cors = require('cors');
const path = require("path");
//Middleware for parsing JSON
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000/",
    credentials: true,
}));

//Registration
app.post('/register', async(req, res) => {
    try{
        const {username, password} = req.body;
        console.log(req.body);
        const user = new User({username, password});
        await user.save();
        res.status(201).json({message: 'Registration successfully'});
    }catch(error){
        res.status(500).json({error: "Registration failed"});
    }
});

//Login
app.post('/login', async(req,res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            res.status(401).json({message:"Invalid username or password"});
        }
        if(user.password !== password){
            res.status(401).json({message:"Invalid username or password"});
        }
        res.status(200).json({message:"Login successful"});
    }catch(error){
        res.status(500).json({error: "Login failed"});
    }
});

const PORT = process.env.PORT || 8000;

connectDB();

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "front-end", "build")));
    res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
    });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});