const form = document.querySelector("form");

console.log(form)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: form.elements["name"].value,
        email: form.elements["email"].value,
        password: form.elements["password"].value,
    };
    
    if (data.password != form.elements["create-password"].value){
        invalidEntry("Passwords do not match");
        return;
    }
    
    if (data.email.split("@")[1] != "umass.edu"){
        invalidEntry("Email is not valid");
        return;
    }
  
    if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/.test(data.password)){
        invalidEntry("Invalid Password");
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
        if (res == 409){
            invalidEntry("Email already in use");
            return;
        }
        
        window.location = "/account";
    });

});

const invalidEntry = (msg) => {
    console.log(msg);
    let errorBox = document.getElementById("error-box");
    document.getElementById("myForm").reset();
    errorBox.innerHTML = msg;
}