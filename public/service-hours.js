const date = new Date().toDateString()
document.querySelector("#subheader").innerText = date

const form = document.querySelector("form")
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        department: form.elements[0].value,
        hours: form.elements[1].value,
        description: form.elements[2].value,
    };

    fetch("/submit-hours", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( (res) => {
        if(res.status == 200){
            document.querySelector(".container").innerHTML = `<div style = "padding: 10px,text-align:center">Hours submitted for reivew.</div>`
        }

    });
});