
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAZTlNJt5o0RZ9KhQQgcZphgCLfBz1P4w0",
    authDomain: "cubewerks-ec743.firebaseapp.com",
    databaseURL: "https://cubewerks-ec743.firebaseio.com",
    projectId: "cubewerks-ec743",
    storageBucket: "cubewerks-ec743.appspot.com",
    messagingSenderId: "89768636380"
  };
  firebase.initializeApp(config);


//reference messages collection
const messagesRef = firebase.database().ref('messages');

//reference firebase storage
const storageService = firebase.storage();
//const storageRef = storageService.ref();

//gets form elements after page has loaded
window.onload=function(){
  
  //function gets triggered any time someone selects a new file via the Choose File upload button
  document.querySelector('.inputfile').addEventListener('change', handleFileUploadChange);
  
  //calls funtion to submit form
  document.getElementById('contact-form').addEventListener('submit', submitForm);
}

//global selectedFile
let selectedFiles = [];
//tracks uploaded files
function handleFileUploadChange(evt) {
  console.log('uploaded');
  
  selectedFiles = evt.target.files;
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

  saveMessage(newMessageRef, await handleFileUploadSubmit(messageID));

  //hide contact form
  document.querySelector('#contact-form').style.display = 'none';
  
  //show contact form after 6 seconds
  setTimeout(function(){ document.querySelector('#contact-form').style.display = 'flex'; }, 6000);
  
  //show submit message
  document.querySelector('.alert').style.display = 'flex';
  
  //hide submit message after 6 seconds
  setTimeout(function(){ document.querySelector('.alert').style.display = 'none'; }, 6000);
  
  //resets contact form
  document.getElementById('contact-form').reset();
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
  var tech_drawing = getCheckedVal('f-drawing')
  var cnc = getCheckedVal('f-cnc')
  var additive_printing = getCheckedVal('f-3dp')
  var digital_printing = getCheckedVal('f-printing')
  var details = getInputVal('f-details')
  
  newMessageRef.set({
    name: name,
    email: email,
    phone: phone,
    company: company,
    project: project,
    CAD: cad,
    rendering: rendering,
    technical_drawing: tech_drawing,
    CNC: cnc,
    additive_printing: additive_printing,
    digital_printing: digital_printing,
    message: details,
    url: download_urls
  })

  console.log('submitted');
}














