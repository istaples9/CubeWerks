// Initialize Firebase
var config = {
  apiKey: "AIzaSyAZTlNJt5o0RZ9KhQQgcZphgCLfBz1P4w0",
  authDomain: "cubewerks-ec743.firebaseapp.com",
  databaseURL: "https://cubewerks-ec743.firebaseio.com",
  projectId: "cubewerks-ec743",
  storageBucket: "cubewerks-ec743.appspot.com",
  messagingSenderId: "89768636380"
};


//calls function to initialize firebase
firebase.initializeApp(config);

//reference messages collection
const messagesRef = firebase.database().ref('messages');

//reference firebase storage
storageService = firebase.storage();


//gets form elements after page has loaded
window.onload=function(){
  
  //function gets triggered any time someone selects a new file via the Choose File upload button
  document.querySelector('.input-file').addEventListener('change', handleFileUploadChange);
 
  //calls function to submit form upon submit trigger
  document.getElementById('contact-form').addEventListener('submit', submitForm); 
}


//global selectedFile and fileNames
let selectedFiles = [];
let fileNames = [];
//tracks uploaded files and displays file names
function handleFileUploadChange(evt) {
  const uploadButton = document.querySelector('.input-file');
  let fileInfo = document.querySelector('.file-info');
  const realInput = document.getElementById('file-upload');
  let files = realInput.files
  
  for (var i = 0; i < files.length; i++) {
    fileNames.push(files[i].name + "<br>");
    selectedFiles.push(files[i]);
  }
  
  fileInfo.innerHTML = fileNames.join("");
  
  console.log('uploaded');
}


//creates databse reference for uploaded files, generates download urls
async function handleFileUploadSubmit(messageID) {
  var download_urls = [];
  var files = Array.from(selectedFiles)
  for (const item of files) {
    var file = item;
    var fileRef = firebase.storage().ref(`${messageID}/${file.name}`);
    
    await fileRef.put(file).then(async function(result){
      //Get URL and store to pass
      await fileRef.getDownloadURL().then(function(result){
        file['url'] = result;
        download_urls.push(" " + file.name + ": " + file.url);
      });
     });
  }
  console.log('Done!');
  console.log(download_urls);
  return download_urls;
}


//submit form
async function submitForm() {
  event.preventDefault();
  
  var newMessageRef = messagesRef.push();
  var messageID = newMessageRef.key;
  
  //changes submit button color and text on form submit
  const submitBtn = document.getElementById('submit-label')
  submitBtn.innerHTML = 'Working...';
  submitBtn.style.backgroundColor = '#E75F41';
  
  saveMessage(newMessageRef, await handleFileUploadSubmit(messageID));
  
  //resets contact form
  document.getElementById('contact-form').reset();
  
  //removes submit button styling and number of selected files on form reset
  document.getElementById('contact-form').addEventListener('reset', styleReset(submitBtn, '', 'Submit'));
}


//get input vals
function getInputVal(id){
  return document.getElementById(id).value;
}


//get checkbox vals
function getCheckedVal(id){
  return document.getElementById(id).checked;
}


//save message to firebase
function saveMessage(newMessageRef, download_urls){
  
  var name = getInputVal('f-name')
  var email = getInputVal('f-email')
  var phone = getInputVal('f-phone')
  var company = getInputVal('f-company')
  var project = getInputVal('f-project')
  var cad = getCheckedVal('f-cad')
  var rendering = getCheckedVal('f-rendering')
  //var tech_drawing = getCheckedVal('f-drawing')
  var scanning = getCheckedVal('f-scanning')
  var additive_printing = getCheckedVal('f-3dp')
  //var laser_cutting = getCheckedVal('f-laser')
  var details = getInputVal('f-details')
  
  newMessageRef.set({
    name: name,
    email: email,
    phone: phone,
    company: company,
    project: project,
    CAD: cad,
    rendering: rendering,
    //technical_drawing: tech_drawing,
    scanning: scanning,
    additive_printing: additive_printing,
    //laser_cutting: laser_cutting,
    message: details,
    url: download_urls
  })

  console.log('submitted');
  alertMsg();
}


//display alert message up form submit
function alertMsg() {
  //show contact form after 6 seconds
  setTimeout(function(){ document.querySelector('#form-container').style.display = 'flex'; }, 6000);
  
  //reduces form opacity
  document.querySelector('#contact-form').style.opacity = .2;
  
  //show submit message
  document.querySelector('#alert').style.display = 'flex';
  window.location.hash = 'alert-text';
  
  //hide submit message after 6 seconds
  setTimeout(function(){ document.querySelector('#alert').style.display = 'none'; }, 6000);
}


//resets element color, text and opacity on form submit
function styleReset(element, color, text) {
  //resets fileInfo text
  document.querySelector('.file-info').innerHTML = '0 files selected';
  
  //resets opacity after duration
  setTimeout(function(){ document.querySelector('#contact-form').style.opacity = 1; }, 6000);
  
  //resets button color
  element.style.backgroundColor = color;
  
  //resets button text
  element.innerHTML = text;
}

