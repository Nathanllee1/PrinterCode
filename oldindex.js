const { exec } = require("child_process");
var fs = require('fs');
var request = require('request');


// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
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

console.log("Initialized")

const query = db.collection("Messages")
  .where("Receiver", "==", credentials.uid)
  .where("Printed", "==", false)


const observer = query.onSnapshot(newMessage => {
  newMessage.docChanges().forEach(change => {
    if (change.type === 'added') {
      const data = change.doc.data()
      console.log(data)
      printImage(data.Data, __dirname + '/pictures/' + data.Data.split("=").slice(-1)[0].replace("-", "") + ".png")
    }
  })
}, err => {
  console.log(`Encountered error: ${err}`);
});

var download = function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log(filename)
    await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

async function printImage(dataURL, token) {
  await download(dataURL,token, async function() {
    await exec("python3 image.py " + token, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    });
  })
}