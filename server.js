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

//attendence form
app.get("/attendance", (req,res) => {
    res.sendFile(__dirname + "/views/attendance.html")
});

//home page
app.get("/index", (req,res) =>{
    res.sendFile(__dirname + "/views/index.html")
});

//admin oage
//home page
app.get("/admin", (req,res) =>{
    res.sendFile(__dirname + "/views/admin.html")
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
            "roles":[],
            "is_admin":false,
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
        bcrypt.compare(req.body.password, logins[(req.body.email).toLowerCase()].password,(err,result) => {
            if(result){ 
                res.cookie("token",logins[(req.body.email).toLowerCase()].token).sendStatus(200);
            }
            else{
                res.sendStatus(409)
            }
    })}
    else{
        res.sendStatus(409)
    }
});

//returns the public data for an account
app.post("/get-account-data", (req,res) => {
    const accountData = user_data[req.cookies.token]

    if(accountData){

        res.status(200).send(accountData)
    }
    else{
        res.sendStatus(409)
    }
});

//Get data from all accounts
app.post("/get-all-data", (req,res) => {
    const accountData = user_data[req.cookies.token]

    if(accountData.is_admin){
        res.status(200).send(user_data)
    }
    else{
        res.sendStatus(409)
    }
});

//updates the data editable data for an average user
app.post("/update-personal-data", (req,res) => {
    if(user_data[req.cookies.token]){
        if(req.body.name){
            user_data[req.cookies.token].name = req.body.name
        }
        if(req.body.show){
            user_data[req.cookies.token].show = req.body.show
        }
        fs.writeFileSync("./database/user-data.json", JSON.stringify(user_data));
        res.sendStatus(200)
    }
    else{
        res.sendStatus(409)
    }
});

http.listen(3000, () => {
    console.log("Listening on port: 3000");
});