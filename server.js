//importing libraries
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fs = require("fs");
const bcrypt = require("bcrypt");
const uuidToken = require("uuid-token-generator");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//setting up Auth
const SALT_ROUNDS = 10;
const tokenGenerator = new uuidToken();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


//pushes public
app.use(express.static(__dirname + "/public"));

//importing data from databases
const logins = JSON.parse(fs.readFileSync(__dirname + "/database/login.json"));
const user_data = JSON.parse(fs.readFileSync(__dirname + "/database/user-data.json"));

//homepage
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/views/index.html");
});

//new account page
app.get("/login", (req,res)=>{
    res.sendFile(__dirname + "/views/login.html")
})

//endpoint for creating a new account
app.post("/create-account", (req,res)=>{
    //tests to see if email is already taken
    console.log(req.body)
    if(logins[(req.body.email).toLowerCase()]){
        res.sendStatus(409);
    }
    else{
        const password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
        const id = tokenGenerator.generate();
        logins[(req.body.email).toLowerCase()] = {
            "password": password,
            "id": id
        };
        user_data[id] = {
            "name":"",
            "following":"",
            "email": req.body.email
        }
        fs.writeFileSync("./database/login.json", JSON.stringify(logins));
        fs.writeFileSync("./database/user-data.json", JSON.stringify(user_data));
        res.cookie("token",id).sendStatus(201);
    }
})

http.listen(3000, () => {
    console.log("Listening on port: 3000");
})