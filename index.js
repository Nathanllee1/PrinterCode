const { execSync } = require("child_process");
var fs = require('fs');
var http = require('https');
var firebase = require("firebase/app");
var credentials = require("./credentials.json")
// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyAsTXK6zgFSmJ3wrkc3fa1KOaJMPWV97Rs",
  authDomain: "print-chatter.firebaseapp.com",
  databaseURL: "https://print-chatter.firebaseio.com",
  projectId: "print-chatter",
  storageBucket: "print-chatter.appspot.com",
  messagingSenderId: "1083499684757",
  appId: "1:1083499684757:web:3afb915df3c8e607784c9c",
  measurementId: "G-VPMQM618TC"
});

// Initialize Firebase
var db = firebase.firestore()

console.log('Firebase Initialized')

const query = db.collection("Messages")
  .where("Receiver", "==", credentials.uid)
  .where("Printed", "==", false)


const observer = query.onSnapshot(newMessage => {
  newMessage.docChanges().forEach(change => {
    if (change.type === 'added') {
      const data = change.doc.data()
      /*console.log(newMessage.getDocument().getId())*/
      const filename = new URL(data.Data).pathname.split("/").slice(-1)[0]
      console.log(filename)
      printImage(data.Data, 'pictures/' + filename)

      /*newMessage.set({
        printed: true
      })
      */
      //db.ref('Messages/' +)
    }
  })
}, err => {
  console.log(`Encountered error: ${err}`);
});

var download = async function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  await http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
  return 'Done'
}

function printImage(dataURL, token) {
  download(dataURL,token, function() {
    console.log("python3 image.py " + token)
    execSync("python3 image.py " + token, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`, ' Printed');
    });
  })
}
