let uData = [];

fetch('/get-all-data', {
    method: "POST",
}).then((data) => {
    if (data.status != 200){
        throw new Error("Failed to recieve user data");
    }
   
    return data.json();
}).then(user_data => {
    uData = user_data.map(x=>x);
    document.getElementById("bar").innerHTML = `<form class="search">
    <input type="text" onkeyup="displayNames()" id="searchbar" placeholder="Search.." name="search">`
    displayNames();
});

function displayNames(){
    let str = ``;

    let input = document.getElementById('searchbar').value;

    let data = uData;
    if (input != "" && input != undefined){
        data = data.filter(p => p.name.substring(0, input.length) === input);
    }

    for(value of data){
        
        let name = value["name"];
        let email = value["email"];
        let hours = value["service_hours"];
        let standing = (value["good_standing"]) ? "Good": "Bad";
    
        str += `<button type="button" class="collapsible">${name}</button>
        <div class="content">
            <p>${name}</p>
            <p>${email}</p>
            <p>Service Hours: ${hours}</p>
            <p>Standing: ${standing}</p>
        </div>`;
    }

    document.getElementById("list").innerHTML = str;

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
        });
    }
}