const form = document.querySelector("form");
console.log(form)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        email: form.elements["email"].value,
        password: form.elements["password"].value,
    };
    
    console.log(data);

    fetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( (res) => {
        //Success 200
        //Failure 409
        console.log(res);
        if (res.status == 200){
            //window.location = "/index";
            return;
        }

        invalidEntry("Invalid Username/Password");
        return;

    });

});

const invalidEntry = (msg) => {
    console.log(msg);
    let errorBox = document.getElementById("error-box");
    document.getElementById("myForm").reset();
    errorBox.innerHTML = msg;
}