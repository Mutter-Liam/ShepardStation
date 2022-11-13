let uData = [];
let loaded = false;

fetch('/get-service', {
    method: "POST",
}).then((data) => {
    if (data.status != 200){
        throw new Error("Failed to recieve user data");
    }
    return data.json();
}).then(user_data => {
    console.log(user_data)
    uData = user_data.map(x=>x);

    displayNames(x => true);
    loaded = true;
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
                <button type="button" id="yes" onclick="onChange(${i},true)" class="butt">Confirm</button>
                <button type="button" id="no" onclick="onChange(${i},false)" class="butt">Deny</button>
            </div>
        </div>`;
        ++i;
    }

    document.getElementById("list").innerHTML = str;

}


const onChange = (i,save) => {
    if(!loaded){return}
    let data = uData[i];
    if(i==0){uData.shift()}
    else{uData.splice(i,i);}       
    displayNames(x=>true);
    if(!save){
        data.hours = 0
    }
    fetch("/update-hours", {
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