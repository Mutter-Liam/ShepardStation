//gets the account data 
let accountData = {
    name: "",
    show: ""
}
fetch("/get-account-data",{
    method: "POST",
}).then((response)=>{
    console.log(response)
    if(response.status == 200){
        return response.json()
    }
}).then((data) => {
    if(data.roles.length !=0){
        document.querySelector("#role").innerHTML = data.roles.join(", ")
    }
    else{
        document.querySelector("#roleContainer").remove()
    }
    document.querySelector("#name").innerHTML = data.name
    document.querySelector("#email").innerHTML = data.email
    document.querySelector("#status").innerHTML = (data.good_standing)?"in good standing":"in bad standing"
    document.querySelector("#show").innerHTML = data.show
    document.querySelector("#hours").innerHTML = data.service_hours
    accountData.name = data.name
    accountData.show = data.show
});

const giveOptions = () =>{
    const container = document.querySelector("#optContainer")
    container.style.setProperty('display',"block")

//listener that removes new lines after entering soemthing
}
document.querySelector("#name").addEventListener('blur',(e)=>{

    document.querySelector("#name").innerHTML = document.querySelector("#name").innerText.replace('\n', "")
})
document.querySelector("#show").addEventListener('blur',(e)=>{

    document.querySelector("#show").innerHTML = document.querySelector("#show").innerText.replace('\n', "")
})

//listener that creates options if an editable content is cahnged
document.querySelector("#name").addEventListener('input',(e)=>{
    giveOptions()
})
document.querySelector("#show").addEventListener('input',(e)=>{
    giveOptions()
})

//listener that 
document.querySelector("#saveButton").onclick = () =>{
    data = {
        name: document.querySelector("#name").innerText,
        show: document.querySelector("#show").innerText,
    }
    fetch("/update-personal-data", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( (res) => {
        document.querySelector("#optContainer").style.setProperty('display',"none")
    })
}

//listener that allows for people to cancel
document.querySelector("#cancelButton").onclick = () =>{
    document.querySelector("#name").innerHTML = accountData.name
    document.querySelector("#show").innerHTML = accountData.show
    document.querySelector("#optContainer").style.setProperty('display',"none")
}

