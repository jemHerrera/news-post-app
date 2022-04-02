// [posts] is an array of objects where post data is stored. 
// Every post is an object pushed into [posts]
// post object contains string and array of images
var posts = []

// toggle() to show and hide elements
// 1st parameter: target element
// 2nd parameter: boolean. Add 'displayed' class if true; remove if false
function toggleElement(element, showElement){
    if(showElement) document.querySelector(element).classList.add('displayed');
    else document.querySelector(element).classList.remove('displayed')
}

// where data from user input is stored before publishing
// gets cleared whenever posted
var newPost = {
    text: '',
    images: []
}

//Whenever image is uploaded, add image data to newPost.images, as well as create a preview element
document.querySelector("#images-upload").addEventListener("change", function(event){

    Object.values(event.target.files).forEach(file => {
        //use FileReader API to read contents of uploaded image
        let reader = new FileReader();
        
        reader.addEventListener("load",function(event){
            let li = document.createElement("li");

            li.innerHTML = `
            <img class='thumbnail' src='${event.target.result}'/>
            <span onclick="removeImage('${event.target.result}', event)" class="material-icons remove">close</span>
            `;
            newPost.images.push(event.target.result)
            // append element to the images-preview
            document.querySelector("#images-preview").appendChild(li);            
        
        });
        
        reader.readAsDataURL(file);
    })                      
    
});

// remove an image from newPost and delete li element
function removeImage(imageData, event){
    newPost.images = newPost.images.filter(image => image != imageData);
    event.target.parentElement.remove();
}


//create onclick function from submit button that will:
//1. take data from elements inside of image-view as well ass the text area and post to [posts]
//2. close new-post modal
//3. clear {newPost}

//add cancel button as well
// css on images, create a slider
//css on upload button; change to image icon and remove the preview text