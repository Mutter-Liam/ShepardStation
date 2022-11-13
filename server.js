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
const { runInNewContext } = require("vm");

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
const posts = JSON.parse(fs.readFileSync(__dirname + "/database/posts.json"));


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
app.get("/form/:form", (req,res) => {
    switch(req.params.form.toLowerCase()){
        case "attendance":
            res.sendFile(__dirname + "/views/attendance.html");
            break;
        case "service-hours":
            res.sendFile(__dirname + "/views/service-hours.html")
            break;
        default:
            res.sendStatus(404)
    }
    
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

//review page
app.get("/review", (req,res) =>{
    res.sendFile(__dirname + "/views/review.html")
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
            "name":req.body.name,
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
        res.status(200).send(Object.values(user_data));
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

//allows a user to submit an attendance form that will update the database
app.post("/submit-attendance", (req,res) => {
    console.log(req.cookies)
    if(user_data[req.cookies.token]){
        if(req.body.code != posts.attendence.code){
            res.sendStatus(403)
        }
        console.log(req.body)
        posts.attendence.responses.push({
            "liked":req.body.liked,
            "improve":req.body.improve
        })
            user_data[req.cookies.token].attendence.unshift(new Date().toDateString())
            console.log(user_data[req.cookies.token])

        fs.writeFileSync("./database/user-data.json", JSON.stringify(user_data));
        fs.writeFileSync("./database/posts.json", JSON.stringify(posts));
        res.sendStatus(200)
    }

});

//Request Announcements
app.post("/get-announcements", (req,res) =>{
    const accountData = user_data[req.cookies.token];

    if(accountData){
        res.status(200).send(posts.announcements);
    }
    else{
        res.sendStatus(409)
    }
});

app.post("/get-service", (req,res) =>{
    const accountData = user_data[req.cookies.token];

    if(accountData){
        res.status(200).send(posts.service_hour_forms);
    }
    else{
        res.sendStatus(409)
    }
});

//endpoint for submitting service hours
app.post("/submit-hours", (req,res)=>{
    const submitter = user_data[req.cookies.token]
    if(submitter){
        posts.service_hour_forms.push({
            id: submitter.id,
            name: submitter.name,
            hours: req.body.hours,
            department: req.body.department,
            description: req.body.description
        })
        fs.writeFileSync("./database/posts.json", JSON.stringify(posts));
        res.sendStatus(200)
    }
    else{
        res.sendStatus(409)
    }
})

app.post("/update-hours", (req,res)=>{
    let data = req.body;
    for ([key, value] of Object.entries(user_data)){
        if(value["name"] === data["name"]){
            user_data[key]["service_hours"] += data["hours"];
        }
    }
    fs.writeFileSync("./database/user_data.json", JSON.stringify(user_data));
});

app.post("/get-posts",(req,res) => {
    res.send(posts.announcements)
});

//end point for creating a post
app.post("/make-post", (req,res)=>{
    if(user_data[req.cookies.token].is_admin){
        const post = {
            "poster":user_data[req.cookies.token].name,
            "date": new Date().toDateString(), 
            "message": req.body.message,
            "image":(req.body.image)?req.body.image:"none"
        }
        posts.announcements.unshift([post])
        fs.writeFileSync("./database/posts.json", JSON.stringify(posts));
        res.sendStatus(200)
    }
    else{
        res.sendStatus(403)
    }
});

http.listen(3000, () => {
    console.log("Listening on port: 3000");
});