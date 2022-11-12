fetch("/get-account-data",{
    method: "POST",
}).then((response)=>{
    if (response.status == 409){
        window.location = "/login";
        return;
    }
    return response.json();
}).then((data) => {
    sessionStorage.setItem("user-data", data);
    
}).catch((r) => window.location = "/login");