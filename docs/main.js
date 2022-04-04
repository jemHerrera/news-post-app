
// where uploaded image src are stored before post
var stagedImages = [];

// show and hide modals
// 2nd parameter: boolean. Add 'displayed' class if true; remove if false
function toggleElement(element, showElement){
    if(showElement) {
        document.querySelector(element).classList.add('displayed');
        // prevent body from scrolling behind modal
        document.querySelector('body').classList.add('modal-open');
    }
    else {
        document.querySelector(element).classList.remove('displayed');
        document.querySelector('body').classList.remove('modal-open');
    }
}

//callback function onchange of text area or image upload
//disable post button if no user input is detected
function checkInput(){
    if(document.querySelector('#text').value
    || stagedImages.length > 0) document.querySelector('#post').classList.remove('disabled');
    else document.querySelector('#post').classList.add('disabled');
}

//For textarea: Automatically adjust height as user types more content
function autoHeight(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

// Event listener whenever an image is uploaded. Accepts multiple image upload
// Add image data to stagedImages & create a preview element
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
            stagedImages.push(event.target.result)
            // append element to the images-preview
            document.querySelector("#images-preview").appendChild(li);  
            // check if image has been added to staged images. if yes, enable post button   
            checkInput();         
        });
        
        reader.readAsDataURL(file);
    })                      
});

// remove the image from stagedImages and delete upload preview
// called when user clicks on 'x' button from the upload preview
function removeImage(imageData, event){
    stagedImages = stagedImages.filter(image => image != imageData);
    event.target.parentElement.remove();
    document.querySelector("#images-upload").value='';
    checkInput();
}
//create post element on feed
function post(){
    // create all the nested elements
    let postContainer = document.createElement("div"),
        profile = document.createElement('img'),
        postDetails = document.createElement('div'),
        postHeader = document.createElement('div'),
        imagesContainer = document.createElement('div'),
        username = document.createElement('p'),
        handle = document.createElement('p'),
        timestamp = document.createElement('p'),
        postText = document.createElement('p');

    // add attributes and values
    postContainer.className = "post";
    profile.className = "profile";
    profile.src = 'icon.png';
    postDetails.className = "post-details";
    postHeader.className = "post-header";
    imagesContainer.className = "image-container"
    //if there's only one image uploaded, add 'single' class. This displays the image in full size
    if(stagedImages.length == 1)imagesContainer.classList.add('single');
    username.className = 'username';
    username.innerText = 'Me'; //static value
    handle.className = 'handle';
    handle.innerText = '@myself'; //static value
    timestamp.className = 'timestamp';
    postText.className = 'post-text';
    postText.innerText = document.querySelector('#text').value;
    
    // date
    let today = new Date(),
        months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
        currentTime = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    
    timestamp.innerText = currentTime;
    
    //append elements
    postContainer.append(profile, postDetails);
    postDetails.append(postHeader, postText, imagesContainer);
    postHeader.append(username, handle, timestamp);

    //add uploaded images to imagesContainer
    //include onclick parameters for view-image, such as image src, time and post text
    stagedImages.forEach(image => {
        var imageItem = document.createElement('img');
        imageItem.src = image;
        imageItem.setAttribute('onclick', `previewImage({
            'previewImage': '${image}',
            'text': '${document.querySelector('#text').value}',
            'time': '${currentTime}'
        })`)
        imagesContainer.appendChild(imageItem);
    })
    document.querySelector('.feed-container').appendChild(postContainer);

    //hide intro, show
    if(document.querySelector('.intro')) document.querySelector('.intro').remove();
    document.querySelector('.feed').classList.add('display');

    //clear create-post modal
    resetInput();
}

//clear all inputs, hide create-post modal and empty stagedImages variable
function resetInput(){
    toggleElement('.create-post', false);
    document.querySelector('#text').value = '';
    document.querySelector('#images-upload').value = '';
    stagedImages = [];
    checkInput();
    //reset textarea height
    autoHeight(document.querySelector('#text'));

    let imagesPreview = document.querySelector('#images-preview');
    while (imagesPreview.firstChild) {
        imagesPreview.removeChild(imagesPreview.firstChild);
    }
}

//when user clicks on an image from the feed, display image view modal
function previewImage(object){
    toggleElement('.view-image', true);
    document.querySelector('.preview-image').src = object.previewImage;
    document.querySelector('.preview-timestamp').innerText = object.time;
    document.querySelector('.preview-text').innerText = object.text;
}