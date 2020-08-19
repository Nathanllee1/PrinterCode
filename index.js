const { execSync } = require("child_process");
var fs = require('fs');
var http = require('https');
var firebase = require("firebase/app");
var credentials = require("./credentials.json")
// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const init = () => {firebase.initializeApp({
  apiKey: "AIzaSyAsTXK6zgFSmJ3wrkc3fa1KOaJMPWV97Rs",
  authDomain: "print-chatter.firebaseapp.com",
  databaseURL: "https://print-chatter.firebaseio.com",
  projectId: "print-chatter",
  storageBucket: "print-chatter.appspot.com",
  messagingSenderId: "1083499684757",
  appId: "1:1083499684757:web:3afb915df3c8e607784c9c",
  measurementId: "G-VPMQM618TC"
})};

const auth = () => firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
  .catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      console.log('Wrong password.');
    } else {
      console.log(errorMessage);
    }
    console.log(error);
  })

const queryDown = (db) => {
  const query = db.collection("Messages")
    .where("Receiver", "==", credentials.uid)
    .where("Printed", "==", false)


  const observer = query.onSnapshot(newMessage => {
    newMessage.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data()
        const filename = new URL(data.Data).pathname.split("/").slice(-1)[0]
        printImage(data.Data, 'pictures/' + filename)
        const id = change.doc.id

        db.collection('Messages').doc(id).set({
          printed: true
        })
      }
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  });

  var download = async function(url, dest, cb) {
    console.log(url)
    var file = await fs.createWriteStream(dest);
    await http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);
      });
    });
    console.log('downloaded')
    return 'Done'
  }

  async function printImage(dataURL, token) {
    await download(dataURL,token, function() {
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

}

const runCycle = async () => {
  await init();
  console.log('Firebase Initialized')
  await auth();
  console.log('Signed in')
  const db = await firebase.firestore()
  console.log('Initialized Database')
  const download = queryDown(db)
}

runCycle()