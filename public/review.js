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

    displayNames(x => true);
});

function displayNames(filter){
    let str = ``;

    let i = 0;
    for(value of uData){
        if (!filter(value)){ ++i; continue;}
        let name = value["name"];
        let department = value["department"];
        let hours = value["hours"];
        let description = value["description"];
        
        str += `<button type="button" class="collapsible">${name}</button>
        <div class="content" id=${"d"+i}>
            <p>Name: ${name}</p>
            <p>Hours Requested: ${hours}</p>
            <p>Department: ${department}</p>
            <p>Description: ${description}</p>
            <div class="button-align">
                <button type="button" id="yes" onclick="onYes(${i})" class="butt">Confirm</button>
                <button type="button" id="no" onclick="onNo(${i})" class="butt">Deny</button>
            </div>
        </div>`;
        ++i;
    }

    document.getElementById("list").innerHTML = str;

}


const onYes = async (i) => {
    let data = uData[i];
    uData.pop(i);       
    displayNames(x=>true);
    await fetch("/update-hours", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

const onNo = async (i) => {
    let data = uData[i];
    uData.pop(i);
    displayNames(x=>true);
}