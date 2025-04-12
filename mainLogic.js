const mainUrl = "https://tarmeezacademy.com/api/v1"

function toggoleLoader(show = true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
    }else{
        document.getElementById("loader").style.visibility = "hidden"
        
    }
}

function loginButton(){
    toggoleLoader(true)
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username": username,
        "password": password
    }

    axios.post(`${mainUrl}/login`, params)
    .then(response => {
        toggoleLoader(false)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        
        // Close the login modal 
        const modal = document.getElementById("login-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        theAlert("logged in successfuly")
        setupUI()
    })
}


function registerButton(){
    toggoleLoader(true)
    const name = document.getElementById("reg-name").value
    const username = document.getElementById("reg-username").value
    const email = document.getElementById("reg-email").value
    const password = document.getElementById("reg-password").value
    const image = document.getElementById("reg-image").files[0]

    let formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    const params = {
        "name": name,
        "email": email,
        "username": username,
        "password": password
    }

    axios.post(`${mainUrl}/register`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(response => {
        toggoleLoader(false)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        
        // Close the login modal 
        const modal = document.getElementById("register-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        theAlert("Registered is successfuly")
        getPosts()
    }).catch((error) => {
        const rong = error.response.data.message
        theAlert(rong, "danger")
    }).finally(() => {
        toggoleLoader(false)
    })
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    theAlert("Logged out successfuly")
    setupUI()
}

function theAlert(massages, type="success"){
    const alertPlaceholder = document.getElementById('alert')
    //alertPlaceholder.style.visibility = "visible"
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    
    appendAlert(massages, type)

  //  setTimeout(() => {
     //   alertPlaceholder.style.visibility = "hidden"
    //}, 5000)
   
}

function createNewPost(){
    let postId = document.getElementById("post-id").value
    let isCreate = postId == null || postId == ""
    const title = document.getElementById("post-title").value
    const body = document.getElementById("post-body").value
    const image = document.getElementById("post-file").files[0]
    toggoleLoader(true)
    let formData = new FormData()
        formData.append("title", title)
        formData.append("body", body)
        formData.append("image", image)

    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    if(isCreate){
        axios.post(`${mainUrl}/posts`, formData, {
            headers: headers
        })
        .then(response => {
            toggoleLoader(false)
            console.log(response)
            const modal = document.getElementById("add-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()  
            theAlert("New Post Has Been Created", "success")
            getPosts()
        })
        .catch((error) => {
            const rong = error.response.data.message
            theAlert(rong, "danger")
        }).finally(() => {
            toggoleLoader(false)
        })
    }else{
        formData.append("_method", "put")
        axios.post(`${mainUrl}/posts/${postId}`, formData, {
            headers: headers
        })
        .then(response => {
            console.log(response)
            const modal = document.getElementById("add-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()  
            theAlert("The Post Has Been Updated", "success")
            getPosts()
        })
        .catch((error) => {
            const rong = error.response.data.message
            theAlert(rong, "danger")
        }).finally(() => {
            toggoleLoader(false)
        })
    }


}

function editPost(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  console.log(post)
  document.getElementById("post-modal-submit-button").innerHTML = "Update"
  document.getElementById("post-id").value = post.id
  document.getElementById("post-title").value = post.title
  document.getElementById("post-body").value = post.body
  //document.getElementById("post-file").src = post.image
  document.getElementById("post-model-title").innerHTML = "Edit Post"
  let postModel = new bootstrap.Modal(document.getElementById("add-post-modal"), {})
  postModel.toggle()
}

function addButton(){
    document.getElementById("post-modal-submit-button").innerHTML = "Create"
    document.getElementById("post-id").value = ""
    document.getElementById("post-title").value = ""
    document.getElementById("post-body").value = ""
    //document.getElementById("post-file").src = post.image
    document.getElementById("post-model-title").innerHTML = "Create A New Post"
    let postModel = new bootstrap.Modal(document.getElementById("add-post-modal"), {})
    postModel.toggle()
}

function deleteButton(postId){
    document.getElementById("delete-post-id").value = postId
    let postModel = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModel.toggle()
}

function deletePost(postId){
    toggoleLoader(true)
    postId = document.getElementById("delete-post-id").value
    const token = localStorage.getItem("token")
    const headers = {
        "authorization": `Bearer ${token}`
    }
    axios.delete(`${mainUrl}/posts/${postId}`, {
        headers: headers 
    }).then(response => {
        console.log(response)
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()  
        theAlert("The Post Has Been Deleted", "info")
        getPosts()
    }).catch((error) => {
        const rong = error.response.data.message
        theAlert(rong, "danger")
    })
       
}

function getThePost(postId){
    window.location = `postDetalls.html?postId=${postId}`
}

function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}

function userProfile(userId){
    window.location = `profile.html?userid=${userId}`
}

function profileClick(){
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}

function setupUI(){
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")

    const addButton = document.getElementById("add-button")

    const commentDiv = document.getElementById("create-comment")
    
    if(token == null){
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
        if(addButton != null){
            addButton.style.setProperty("display", "none", "important")
        }
        if(commentDiv != null){
            commentDiv.style.setProperty("display", "none", "important")
        }
    }else{
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")
        if(addButton != null){
            addButton.style.setProperty("display", "block", "important")
        }
        if(commentDiv != null){
            commentDiv.style.setProperty("display", "flex", "important")
        }

        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-image-user").src = user.profile_image
    }

}

