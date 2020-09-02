const functions = require('firebase-functions');
const express = require('express');
const app = express();
const {
    getAllPosts, 
    createOnePost, 
    getPost, 
    commentOnPost, 
    likePost, 
    unlikePost,
    deletePost,
    deleteComment
} = require('./handlers/posts');

const {
    signUp, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead,
    recordDetails
} = require('./handlers/users');

const {FBAuth} = require('./util/FBAuth');
const admin = require('firebase-admin');

const cors = require('cors');
app.use(cors());


// Getting Data from the database(getposts route) > baseurl/api/getposts
app.get('/getposts', getAllPosts);

//Adding posts to the database(create posts route) > baseurl/api/createposts
app.post('/createposts', FBAuth, createOnePost);

// Authentication SignUp (Signup route)> baseurl/api/signup
app.post('/signup',signUp);

//Authentication Login(Login Route) > baseurl/api/login 
app.post('/login', login);

//Uploading Image by users(Image Upload Route) > baseurl/api/user/image
app.post('/user/image', FBAuth, uploadImage);

// Adding extra user details(addUserDetails route) > baseurl/api/user
app.post('/user', FBAuth, addUserDetails);

//Get own User Details for repeated use after login once(getAuthenticatedUser route) > baeurl/api/user
app.get('/user', FBAuth, getAuthenticatedUser);

//Get a Post by its postId(getPost route) > baseurl/api/post/:postId
app.get('/post/:postId', getPost);

//Add a Comment on a Post(commentOnPost route) > baseurl/api/post/:postId/comment
app.post('/post/:postId/comment', FBAuth, commentOnPost);

//Put a like on a particular Post(likePost route) > baseurl/api/post/:postId/like
app.get('/post/:postId/like', FBAuth, likePost);

//Unlike a previously liked post(unlike route) > baseurl/api/post/:postId/unlike
app.get('/post/:postId/unlike', FBAuth, unlikePost);

//Delete an Existing Post(deletePost route) > baseurl/api/post/:postId
app.delete('/post/:postId', FBAuth, deletePost);

//Getting User Details based on User Handle (getUserDetails route) > baseurl/api/user/:handle
app.get('/user/:handle', getUserDetails);

//Marking Notifications as read by the User(markNotificationsRead route) > baseurl/api/notifications
app.post('/notifications', FBAuth, markNotificationsRead);

//Deleteing a comment from a particular Post(deleteComment route) > baseurl/api/post/:postId/comment/:commentId
app.delete('/post/:postId/comment/:commentId', FBAuth, deleteComment);

//Record visitors details(recordDetails route) > baseurl/api/record
app.post('/record/:ip', recordDetails);

exports.api = functions.region('us-central1').https.onRequest(app);


//Triggers for creating Notifications for various types
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
            .onCreate((snapshot) => {
            return admin.firestore()
                 .collection('Posts')
                 .doc(snapshot.data().postId)
                 .get()
                 .then((doc) => {
                     if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                         return admin.firestore()
                                     .collection('notifications')
                                     .doc(snapshot.id)
                                     .set({
                                         createdAt: new Date().toISOString(),
                                         sender: snapshot.data().userHandle,
                                         recipient: doc.data().userHandle,
                                         type: 'like',
                                         read: false,
                                         postId: doc.id
                                     });
                     }
                 })
                 .catch(err => {
                     console.error(err);
                 });
            });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
            .onDelete((snapshot) => {
                return admin.firestore()
                     .collection('notifications')
                     .doc(snapshot.id)
                     .delete()
                     .catch(err => {
                         console.error(err);
                     });
            });
    
exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
            .onCreate((snapshot) => {
                return admin.firestore()
                 .collection('Posts')
                 .doc(snapshot.data().postId)
                 .get()
                 .then((doc) => {
                     if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                         return admin.firestore()
                                     .collection('notifications')
                                     .doc(snapshot.id)
                                     .set({
                                         createdAt: new Date().toISOString(),
                                         sender: snapshot.data().userHandle,
                                         recipient: doc.data().userHandle,
                                         type: 'comment',
                                         read: false,
                                         postId: doc.id
                                     });
                     }
                 })
                 .catch(err => {
                     console.error(err);
                 });
            });

//Trigger for changing the image Url of all posts if users changes their profile picture
exports.onUserImageChange = functions.firestore.document('/users/{userId}')
            .onUpdate((change) => {
                if(change.before.data().imageUrl !== change.after.data().imageUrl){
                    let batch = admin.firestore().batch();
                    return admin.firestore()
                            .collection('Posts')
                            .where('userHandle', '==', change.before.data().handle)
                            .get()
                            .then((data) => {
                                data.forEach((doc) => {
                                    const post = admin.firestore()
                                                      .collection('Posts')
                                                      .doc(doc.id);
                                    batch.update(post, {userImage: change.after.data().imageUrl });
                                });
                                return batch.commit();
                            });
                }
                else{
                    return true;
                }
            });

//Trigger for deleting Likes, Comments and Notifications related to a Post if the user deletes that particular post
exports.onPostDelete = functions.firestore.document('/Posts/{postId}')
            .onDelete((snapshot, context) => {
                const postId = context.params.postId;
                let batch = admin.firestore().batch();
                return admin.firestore()
                            .collection('comments')
                            .where('postId', '==', postId)
                            .get()
                            .then((data) => {
                                data.forEach((doc) => {
                                    const deleteComments = admin.firestore()
                                                                .collection('comments')
                                                                .doc(doc.id);
                                    batch.delete(deleteComments);
                                });
                                return admin.firestore()
                                            .collection('likes')
                                            .where('postId', '==', postId)
                                            .get();
                            })
                            .then((data) => {
                                data.forEach((doc) => {
                                    const deleteLikes = admin.firestore()
                                                             .collection('likes')
                                                             .doc(doc.id);
                                    batch.delete(deleteLikes);
                                });
                                return admin.firestore()
                                            .collection('notifications')
                                            .where('postId', '==', postId)
                                            .get();
                            })
                            .then((data) => {
                                data.forEach((doc) => {
                                    const deleteNotifications = admin.firestore()
                                                                     .collection('notifications')
                                                                     .doc(doc.id);
                                    batch.delete(deleteNotifications);
                                });
                                return batch.commit();
                            })
                            .catch(err => {
                                console.error(err);
                            });
            });


// Trigger for deleting notifications if comment is deleted
exports.deleteNotificationOnCommentDelete = functions.firestore.document('/comments/{id}')
            .onDelete((snapshot) => {
                return admin.firestore()
                            .collection('notifications')
                            .doc(snapshot.id)
                            .delete()
                            .catch(err => {
                                console.error(err);
                            });
            });

