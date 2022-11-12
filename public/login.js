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
        alert("login sucessful")
        //Success 201
        //Failure 409
    });

});

const invalidEntry = (msg) => {

}