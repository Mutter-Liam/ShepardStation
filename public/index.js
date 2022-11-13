const feed = document.querySelector("#container")
fetch("/get-posts", {method: "POST"}).then((data) =>{
    return data.json()
}).then((res)=>{
    for(let i = 0;i<res.length;i++){
        let post = res[i]
        feed.innerHTML += `<div class = "announcement">
        <div class = "announcementHeader">
            <div class = "poster">${post.poster}</div><div class = "date">${post.date}</div>
        </div>
        <div class = "message">
        ${post.message}
        </div>
        ${(post.image=="none")?"":`<img src = "${post.image}"/>`}
    </div>`
    }
});