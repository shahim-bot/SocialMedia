const {admin} = require('../util/admin');

//Getting All Posts from the database===========================================================
exports.getAllPosts = (request,response) => {
    admin
    .firestore()
    .collection('Posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data =>{
        let posts = [];
        data.forEach(docs =>{
            posts.push({
                postId: docs.id,
                body: docs.data().body,
                userHandle: docs.data().userHandle,
                createdAt: docs.data().createdAt,
                commentCount: docs.data().commentCount,
                likeCount: docs.data().likeCount,
                userImage: docs.data().userImage
            });
        });
        return response.json(posts);
    })
    .catch(err => console.error(err));
};


//Creating a single Post by a respective user===================================================
exports.createOnePost = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({ body: 'Body must not be empty' });
      }
    const newPost = {
        body: request.body.body,
        userHandle: request.user.handle,
        createdAt: new Date().toISOString(),
        userImage: request.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    };

    admin.firestore()
         .collection('Posts')
         .add(newPost)
         .then(docs => {
                const resultPost = newPost;
                resultPost.postId = docs.id;
                response.json(resultPost);
         })
         .catch(err => {
                response.status(500).json({error: 'something went wrong' });
                console.error(err);
         });
};


//Get a Single post by its Post ID==============================================================
exports.getPost = (request, response) => {
    let postData = {};
    admin.firestore()
         .collection('Posts')
         .doc(request.params.postId)
         .get()
         .then((doc) => {
             if(!doc.exists){
                 response
                    .status(404)
                    .json({ error: "Post Not Found"});
             }
             postData = doc.data()
             postData.postId = doc.id;
             return admin.firestore()
                         .collection('comments')
                         .orderBy('createdAt', 'desc')
                         .where('postId', '==', request.params.postId)
                         .get();
         })
         .then((data) => {
             postData.comments = [];
             data.forEach((doc) => {
                 let singleComment = {
                     ...doc.data(),
                     commentId: doc.id
                 }
                 postData.comments.push(singleComment);
             });
             return response.json(postData);
         })
         .catch((err) => {
             console.error(err);
             response
                .status(500)
                .json({ error: err.code});
         });
};


//Adding a comment on a Post====================================================================
exports.commentOnPost = (request, response) => {
    if(request.body.body.trim() === ''){
        return response
            .status(400)
            .json({ comment: "Must not be Empty"});
    }
    const newComment = {
        body:request.body.body,
        createdAt: new Date().toISOString(),
        postId: request.params.postId,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl
    };

    admin.firestore()
         .collection('Posts')
         .doc(request.params.postId)
         .get()
         .then((doc) => {
             if(!doc.exists){
                 return response
                            .status(404)
                            .json({error: "Post not Found!!"});
             }
             return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
            })
            .then(() => {
                return admin.firestore()
                         .collection('comments')
                         .add(newComment);
            })
            .then((docs) => {
                     response.json({
                         ...newComment,
                         commentId: docs.id
                     });
            })
            .catch(err => {
                console.error(err);
                response
                    .status(500)
                    .json({ error:"something Went wrong"});
            });
};


//Put a Like on a Post==========================================================================
exports.likePost = (request, response) => {
    const likeDocument = admin.firestore()
                              .collection('likes')
                              .where('userHandle', '==', request.user.handle)
                              .where('postId', '==', request.params.postId)
                              .limit(1);

    const postDocument = admin.firestore()
                              .collection('Posts')
                              .doc(request.params.postId);

    let postData;

    postDocument.get()
                .then((doc) => {
                    if(doc.exists){
                        postData = doc.data();
                        postData.postId = doc.id;
                        return likeDocument.get();
                    }
                })
                .then((data) => {
                    if(data.empty){
                        admin.firestore()
                             .collection('likes')
                             .add({
                                 postId: request.params.postId,
                                 userHandle: request.user.handle
                             })
                             .then(() => {
                                 postData.likeCount++;
                                 return postDocument.update({ likeCount: postData.likeCount});
                             })
                             .then(() => {
                                 response.json(postData);
                             });
                    }
                    else{
                        return response 
                                    .status(400)
                                    .json({ message: "Post already Liked"});
                    }
                })
                .catch(err => {
                    console.error(err);
                    return response
                            .status(500)
                            .json({ error: err.code});
                });
};


//Remove your like from a Post==================================================================
exports.unlikePost = (request, response) => {
    const likeDocument = admin.firestore()
                              .collection('likes')
                              .where('userHandle', '==', request.user.handle)
                              .where('postId', '==', request.params.postId)
                              .limit(1);

    const postDocument = admin.firestore()
                              .collection('Posts')
                              .doc(request.params.postId);

    let postData;

    postDocument.get()
                .then((doc) => {
                    if(doc.exists){
                        postData = doc.data();
                        postData.postId = doc.id;
                        return likeDocument.get();
                    }
                })
                .then((data) => {
                    if(data.empty){
                        return response 
                                    .status(400)
                                    .json({ message: "Post not Liked yet"});
                    }
                    else{
                        admin.firestore()
                             .collection('likes')
                             .doc(data.docs[0].id)
                             .delete()
                             .then(() => {
                                 postData.likeCount--;
                                 return postDocument.update({ likeCount: postData.likeCount});
                             })
                             .then(() => {
                                 return response.json(postData);
                             });
                    }
                })
                .catch(err => {
                    console.error(err);
                    return response
                            .status(500)
                            .json({ error: err.code});
                });
};


//Delete an Existing Post========================================================================
exports.deletePost = (request, response) => {
    const document = admin.firestore()
                          .collection('Posts')
                          .doc(request.params.postId);
    document.get()
            .then((doc) => {
                if(!doc.exists){
                    return response.status(404).json({error: "Post not Found!!"});
                }
                if(doc.data().userHandle !== request.user.handle){
                    return response.status(403).json({error: "Unauthorized" });
                }
                else{
                    return document.delete();
                }
            })
            .then(() => {
                response.json({message: "Post delelted successfully"});
            })
            .catch(err => {
                console.error(err);
                response.status(500).json({error: err.code});
            });
};


exports.deleteComment = (request, response) => {
    const commentDocument = admin.firestore()
                          .collection('comments')
                          .doc(request.params.commentId);
    const postDocument = admin.firestore()
                              .collection('Posts')
                              .doc(request.params.postId);
    commentDocument.get()
                   .then(doc => {
                       if(!doc.exists){
                           return response.status(404).json({ error: "Comment Not Found"});
                       }
                       else if(doc.data().userHandle !== request.user.handle){
                           return response.status(403).json({ error: "Unauthorized" });
                       }
                       else{
                           commentDocument.delete();
                           return postDocument.get()
                            .then((doc) => {
                                      if(!doc.exists){
                                          return response.status(404).json({ error: "Post not Found" });
                                      }
                                      let postData = doc.data();
                                      postData.commentCount--;
                                      return postDocument.update({ commentCount: postData.commentCount });
                              })
                              .then(() => {
                                  return response.json({message: "Comment deleted Successfully"});
                              })
                       }
                   })
                   .catch(err => {
                       console.error(err);
                       return response.status(500).json({error: err.code});
                   });
}
