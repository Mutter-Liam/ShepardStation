//gets the account data 
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
});



