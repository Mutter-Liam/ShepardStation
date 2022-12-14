


fetch("/get-account-data",{
    method: "POST",
}).then((response)=>{

    if(response.status == 200){
        return response.json()
    }
}).then(data => {
    let name = data["name"];
    if (data["is_admin"]){
        document.getElementById("nav").innerHTML = `
        <div class="topnav">
            <a class="active" href="/index">Home</a>
            <a href="/form/service-hours">Service Hours</a>
            <a href="/form/attendance">Attendance</a>
            <a href="/admin" haspopup="true">Admin</a>
            <a href="/directory" haspopup="true">Directory</a>
            <a href="/new-post">New Post</a>
            <a onclick="signout()" id="signout">Sign Out</a>
            <a id="signout" href="/account">${name}</a>
        </div>`;
    }
    else{
        document.getElementById("nav").innerHTML = `<div class="topnav">
            <a class="active" href="/index">Home</a>
            <a href="/form/attendance">Attendance</a>
            <a href="/form/service-hours">Service Hours</a>
            <a href="/directory" haspopup="true">Directory</a>
            <a onclick="signout()" id="signout">Sign Out</a>
            <a href="/account" id="name">${name}</a>
        </div>`;
    }
})

const signout = () => {
    document.cookie = "token=";
   window.location = "/login";
}