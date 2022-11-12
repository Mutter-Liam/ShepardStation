document.getElementById("nav").innerHTML = `<div class="topnav">
<a class="active" href="/index">Home</a>
<a href="/account">My Profile</a>
<a href="#contact">Stuff</a>
</div>`;


fetch("/get-account-data",{
    method: "POST",
}).then((response)=>{
    console.log(response)
    if(response.status == 200){
        return response.json()
    }
}).then(data => {
    console.log(data);
    if (data["is_admin"]){
        document.getElementById("nav").innerHTML = `
        <div class="topnav">
            <a class="active" href="/index">Home</a>
            <a href="/account">My Profile</a>
            <a href="#contact">Stuff</a>
            <a href="/admin">Admin</a>
        </div>`;
    }
})