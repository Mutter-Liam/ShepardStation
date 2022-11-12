const { json } = require("body-parser");
const { application } = require("express");

const form = document.querySelector("form");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        email: form.elements["email"].value,
        password: form.elements["password"].value,
    };
    
    if (data.password !== form.elements["create-password"]){
        invalidEntry("Password does not match.");
        return;
    }

    if (data.email.split("@")[1] != "umass.edu"){
        invalidEntry("Email is not vallid");
        return;
    }
    

    fetch("/create-account", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( (res) => {
        //Success 201
        //Failure 409
    });

});


const invalidEntry = (msg) => {

}