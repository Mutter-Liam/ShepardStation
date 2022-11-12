console.log("your mom sucks me good")

//gets the account data 
fetch("/get-account-data",{
    method: "POST",
}).then((response)=>{
    console.log(response)
    if(response.status == 200){
        return response.json()
    }
}).then((data) => {
    console.log(data)
});