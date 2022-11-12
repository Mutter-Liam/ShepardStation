//importing libraries
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fs = require("fs");
const bcrypt = require("bcrypt");
const uuidToken = require("uuid-token-generator");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { allowedNodeEnvironmentFlags } = require("process");

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
});

//page to view account info
app.get("/account", (req,res)=>{
    res.sendFile(__dirname + "/views/account.html")
});

//page to create an account
app.get("/create-account", (req,res) =>{
    res.sendFile(__dirname + "/views/create-account.html")
});

//home page
app.get("/index", (req,res) =>{
    res.sendFile(__dirname + "/views/index.html")
});

//endpoint for creating a new account
app.post("/create-account", (req,res)=>{
    //tests to see if email is already taken
    console.log(req.body)
    if(logins[(req.body.email).toLowerCase()]){
        res.sendStatus(409);
    }
    else{
        const password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
        const token = tokenGenerator.generate();
        logins[(req.body.email).toLowerCase()] = {
            "password": password,
            "token": token
        };
        user_data[token] = {
            "name":"",
            "roles":"",
            "email": req.body.email,
            "service_hours": 0,
            "good_standing": true,
            "show":"",
            "attendence":[]

        }
        fs.writeFileSync("./database/login.json", JSON.stringify(logins));
        fs.writeFileSync("./database/user-data.json", JSON.stringify(user_data));
        res.cookie("token",token).sendStatus(201);
    }
});

//processess login 
app.post("/login", (req,res) => {
    if(logins[(req.body.email).toLowerCase()]){
        if(bcrypt.compare(req.body.password, logins[(req.body.email).toLowerCase()].password)){
            res.sendStatus(200).send(logins[(req.body.email).toLowerCase()].token)
        }
        else{
            res.sendStatus(409)
        }
    }
    else{
        res.sendStatus(409)
    }
});

app.post("/get-account-data", (req,res) => {
    const accountData = user_data[req.cookies.token]
    if(accountData){
        console.log(accountData)
        res.status(200).send(accountData)
    }
    else{
        res.sendStatus(409)
    }
});

http.listen(3000, () => {
    console.log("Listening on port: 3000");
});