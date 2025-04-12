
setupUI()

let currentPage = 1

// Infinit scroll for the page
window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 5;
    
    if(endOfPage){
        currentPage = currentPage + 1
        getPosts(currentPage)
    }
    
})



function getPosts(page = 1){
    
    toggoleLoader(true)    
    axios.get(`${mainUrl}/posts?limit=5&page=${page}`)
    .then(response =>{
        toggoleLoader(false)
        const posts = response.data.data
        for (post of posts){
            let user = getCurrentUser()
            let isMyPost = user != null && post.author.id == user.id
            let editButton = ""
            let deleteButton = ""
            if(isMyPost){
                editButton = `
                <button style="border: 0; float:right;" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                </button>
                `
                deleteButton = `
                <button style="border: 0; float:right;color: rgba(199, 5, 5, 0.822)" onclick="deleteButton(${post.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
                `
            }
            let postTitle = ""
            if(post.title != null){
                postTitle = post.title
            }
            let content = `
            <div class="card my-5" style="cursor: pointer;">
                <div class="card-header" style="background-color: #eee; cursor: default;">
                    <img src="${post.author.profile_image}" onclick="userProfile(${post.author.id})" style="width: 40px; height: 40px; border-radius: 50% 50%; cursor: pointer" alt="">
                    <b onclick="userProfile(${post.author.id})" style="cursor: pointer">@${post.author.username}</b>
                    ${editButton}
                    ${deleteButton}
                </div>
                <div class="card-body" onclick="getThePost(${post.id})">
                    <img src="${post.image}" class="w-100" alt="">
                    <h6 style="color: #777;">${post.author.created_at}</h6>
                    <h4>${postTitle}</h4>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                        </svg>
                        <span>(${post.comments_count}) Comments</span>
                        <span id="post-tags-${post.id}">
                        </span>
                    </div>
                </div>
            </div>
            `
            document.getElementById("posts").innerHTML += content
            
            let currentPostTage = `post-tags-${post.id}`
            document.getElementById(currentPostTage).innerHTML = ""
            for(tag of post.tags){
                let theTag = `
                <button class="btn btn-sm rounded-5" style= "background-color: #777; color: white;">
                    ${tag.name}
                </button>
                `
                document.getElementById(currentPostTage).innerHTML += theTag
            }
            
        }    
    })
}



getPosts()

