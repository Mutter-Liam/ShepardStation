const date = new Date().toDateString()
document.querySelector("#subheader").innerText = date

const form = document.querySelector("form")
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        code: form.elements[0].value,
        liked: form.elements[1].value,
        improve: form.elements[2].value,
    };

    fetch("/submit-attendance", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( (res) => {
        if (res.status == 403){
            alert("incorrect attendance code")
            return;
        }
        if(res.status == 200){
            document.querySelector(".container").innerHTML = `<div style = "padding: 10px,text-align:center">Attendance Submitted Sucessfully</div>`
        }

    });
});