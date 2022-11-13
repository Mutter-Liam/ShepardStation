const date = new Date().toDateString()
document.querySelector("#subheader").innerText = date

const form = document.querySelector("form")
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        message: form.elements[0].value,
    };

    fetch("/make-post", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( (res) => {
        if(res.status == 200){
            window.location = '/'
        }

    });
});