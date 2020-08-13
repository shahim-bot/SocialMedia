export const proxyUrl = "https://cors-anywhere.herokuapp.com/";

//User action URLS
export const loginUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/login';
export const signupUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/signup';
export const getUserUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/user';
export const uploadImageUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/user/image';
export const markNotificationsReadUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/notifications';
export const updateUserDetailsUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/user';

//Data actions URLS
export const getPostsUrl = 'https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/getposts';
export const likeAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/:postId/like`;
export const unlikeAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/:postId/unlike`;
export const deleteAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/:postId`;
export const createAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/createposts/`;
export const getOnePostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/:postId`;
export const commentOnPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/:postId/comment`;
export const getUserByHandleUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/user/:handle`;
