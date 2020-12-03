const functions = require('firebase-fuction'); 
    
Const  = require('express')();

const FBAuth = require('./utill/fbAuth');

const { getAllscreams, postonescream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails } = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/screams', FBAuth, postonescream);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails)

// users routes
app.post('/signup',signup);
app.post('/login',login);

exports.api = functions.region('europe-west1').https.onRequest(app);
