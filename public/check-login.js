fetch("/get-account-data",{
    method: "POST",
}).then((response)=>{
    
    if(response.status != 200){
        window.location = "/index";
    }
});