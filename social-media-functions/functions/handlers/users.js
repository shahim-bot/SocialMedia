const admin = require('firebase-admin');
const firebase = require('firebase');
const config = require('../util/config');
const {validateSignupData, validateLoginData, reducedUserDetails} = require('../util/validators');
const { ResultStorage } = require('firebase-functions/lib/providers/testLab');
firebase.initializeApp(config);
const os = require('os');

const networkInterfaces = os.networkInterfaces();


//Authentication Signup=========================================================================

exports.signUp = (request,response) => {
    const newUser ={
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    let token, userId;

    const {valid, errors} = validateSignupData(newUser);

    if(!valid){
        return response
                .status(400)
                .json(errors);
    }

    const noImg = 'no-img.png';

    admin
    .firestore()
    .collection('users')
    .doc(newUser.handle)
    .get()
    .then((doc) => {
        if(doc.exists){
            return response
                    .status(400)
                    .json({handle: 'this handle already exists'});
        }
        else{
            return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email,newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId: userId
        };

        return admin
                .firestore()
                .collection('users')
                .doc(newUser.handle)
                .set(userCredentials);
    })
    .then(() => {
        return response
                .status(201)
                .json({ token: token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return response
                    .status(400).
                    json({ email: 'Email already in use' });
        }
        else{
            return response 
                    .status(500)
                    .json({ general: 'Something went Wrong, Please try Again!!'});
        }
        
    });
};


//Authentication Login==========================================================================

exports.login = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    };

    const {valid, errors} = validateLoginData(user);
    if(!valid){
        return response
                .status(400)
                .json(errors);
    }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return response
                    .json({ token:token });
        })
        .catch(err => {
            console.error(err);
                return response
                        .status(403)
                        .json({ general: 'Wrong creedentials, please try again!'});

        });
};


// Adding extra user Details====================================================================

exports.addUserDetails = (request, response) => {
    let userDetails = reducedUserDetails(request.body);

    admin.firestore()
            .collection('users')
            .doc(request.user.handle)
            .update(userDetails)
            .then(() => {
                response.json({message: "Details added successfully"});
            })
            .catch(err => {
                console.error(err);
                return response
                        .status(500)
                        .json({error: err.code});
            })

};


//Getting own Authenticated User details========================================================
exports.getAuthenticatedUser = (request, response) => {
    let userData = {};
    admin.firestore()
         .collection('users')
         .doc(request.user.handle)
         .get()
         .then((doc) => {
            if(doc.exists){
                userData.credentials = doc.data();
                return admin.firestore()
                            .collection('likes')
                            .where('userHandle', '==', request.user.handle)
                            .get();
            }
         })
         .then((data) => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });
            return admin.firestore()
                        .collection('notifications')
                        .where('recipient', '==', request.user.handle)
                        .orderBy('createdAt', 'desc')
                        .get();
         })
         .then((data) => {
             userData.notifications = [];
             data.forEach(doc => {
                 userData.notifications.push({
                     recipient: doc.data().recipient,
                     sender: doc.data().sender,
                     createdAt: doc.data().createdAt,
                     postId: doc.data().postId,
                     type: doc.data().type,
                     read: doc.data().read,
                     notificationId: doc.id

                 });
             });
             return response.json(userData);
         })
         .catch((err) => {
             console.error(err);
             response
                .status(500)
                .json({error: err.code});
         });
};


//Uploading Image for profile picture===========================================================

exports.uploadImage = (request, response) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    let imageFileName;
    let imageToBeUploaded = {};

    const busboy = new BusBoy({ headers: request.headers });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return response
                    .status(400)
                    .json({ error: "Wrong File type Submitted"});
        }
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        imageFileName = `${Math.round(Math.random()*100000000000).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
        admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return admin
                    .firestore()
                    .collection('users')
                    .doc(request.user.handle)
                    .update({imageUrl: imageUrl});
        })
        .then(() => {
            return response.json({ message: 'Image uploaded successfully'});
        })
        .catch(err => {
            console.error(err);
            return response
                    .status(500)
                    .json({ error: err.code });
        });
    });
    busboy.end(request.rawBody);
};


//Getting User details based on User Handle=======================================================
exports.getUserDetails = (request, response) => {
    let userDetails = {};
    admin.firestore()
         .collection('users')
         .doc(request.params.handle)
         .get()
         .then((doc) => {
             if(doc.exists){
                 userDetails.user = doc.data();
                 return admin.firestore()
                             .collection('Posts')
                             .where('userHandle', '==', request.params.handle)
                             .orderBy('createdAt', 'desc')
                             .get();
             }
             else{
                 return response.status(404).json({error: "User not found"});
             }
         })
         .then((data) => {
             userDetails.posts = [];
             data.forEach((doc) => {
                 userDetails.posts.push({
                     body: doc.data().body,
                     createdAt: doc.data().createdAt,
                     userHandle: doc.data().userHandle,
                     userImage: doc.data().userImage,
                     likeCount: doc.data().likeCount,
                     commentCount: doc.data().commentCount,
                     postId: doc.id
                 });
             });
             return response.json(userDetails);
         })
         .catch(err => {
             console.error(err);
             return response.status(500).json({error: err.code});
         });
};


//Marking notifications as read by the User========================================================
exports.markNotificationsRead = (request, response) => {
    let batch = admin.firestore().batch();
    request.body.forEach((notificationId) => {
        const notification = admin.firestore()
                                  .collection('notifications')
                                  .doc(notificationId);
        batch.update(notification, {read: true});
    });
    batch.commit()
    .then(() => {
        response.json({message: "Notifications marked Read"});
    })
    .catch(err => {
        console.error(err);
        response.status(500).json({error: err.code});
    });
};


//Recording vistors details
exports.recordDetails = (request, response) => {

    let ipAddress = request.params.ip;

    const visits = admin.firestore()
                        .collection('VisitorDetails')
                        .doc('PersonalWebsiteDetails');

    visits.get()
          .then((doc) => {
              let data = doc.data();
              let initialVisitors = data.visits;
              let initialIpAddressArray = [...data.addresses];
              let finalVisitors = initialVisitors + 1;
              initialIpAddressArray.push(ipAddress);
              console.log("data: "+data.addresses);
              console.log("Initial Array: "+initialIpAddressArray);
              return visits.set({
                  visits: finalVisitors,
                  addresses: initialIpAddressArray
              });
          })
          .then(() => {
              return response.status(200)
                             .json({record: "Details Recorded"});
          })
          .catch(err => {
              console.log(err);
              return response.status(400)
                             .json({record: "Details not Recorded"});
          });
};