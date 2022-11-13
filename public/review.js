let uData = [];

fetch('/get-service', {
    method: "POST",
}).then((data) => {
    if (data.status != 200){
        throw new Error("Failed to recieve user data");
    }
   
    return data.json();
}).then(user_data => {
    uData = user_data.map(x=>x);

    displayNames();
});

function displayNames(){
    let str = ``;


    for(value of uData){
        
        let name = value["name"];
        let department = value["department"];
        let hours = value["hours"];
        let description = value["description"];
    
        str += `<button type="button" class="collapsible">${name}</button>
        <div class="content">
            <p>Name: ${name}</p>
            <p>Hours Requested: ${hours}</p>
            <p>Department: ${department}</p>
            <p>Description: ${description}</p>
            <div class="button-align">
                <button type="button" id="yes" class="butt">Confirm</button>
                <button type="button" id="no" class="butt">Deny</button>
            </div>
        </div>`;
    }

    document.getElementById("list").innerHTML = str;

}