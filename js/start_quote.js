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
storageService = firebase.storage();

//gets form elements after page has loaded
window.onload=function(){
  
  //function gets triggered any time someone selects a new file via the Choose File upload button
  document.querySelector('.input-file').addEventListener('change', handleFileUploadChange);
 
  //calls function to submit form upon submit trigger
  document.getElementById('contact-form').addEventListener('submit', submitForm);
  
  //calls function to count uploaded files upon file change
  document.querySelector('.input-file').addEventListener('click', fileCount);
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
  
  //changes submit button on click
  const submitBtn = document.getElementById('submit-label')
  submitBtn.innerHTML = 'Working...';
  submitBtn.style.backgroundColor = '#E75F41';
  
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
}


//resets element color and text
function styleReset(element, color, text) {
  //resets fileCount text
  document.querySelector('.file-info').innerHTML = 0 + ' files selected';
  
  element.style.backgroundColor = color;
  element.innerHTML = text;
}


//updates upload file info with file count
function fileCount() {
  const uploadButton = document.querySelector('.input-file');
  const fileInfo = document.querySelector('.file-info');
  const realInput = document.getElementById('file-upload');
  let fileCount = 0;

  uploadButton.addEventListener('click', (e) => {
    realInput.click();
  });

  realInput.addEventListener('change', () => {
    fileCount += realInput.files.length;
    fileInfo.innerHTML = fileCount + ' files selected';
  });
}
