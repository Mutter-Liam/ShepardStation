


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
            <a href="/account">My Profile</a>
            <a href="#contact">Stuff</a>
            <a href="/admin">Admin</a>

            <a onclick="signout()" id="signout">Sign Out</a>
            <a id="signout">${name}</a>
        </div>`;
    }
    else{
        document.getElementById("nav").innerHTML = `<div class="topnav">
            <a class="active" href="/index">Home</a>
            <a href="#contact">Stuff</a>

            <a onclick="signout()" id="signout">Sign Out</a>
            <a id="name">${name}</a>
        </div>`;
    }
})

const signout = () => {
    document.cookie = "token=";
   window.location = "/login";
}