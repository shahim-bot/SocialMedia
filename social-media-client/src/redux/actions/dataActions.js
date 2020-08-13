import { 
    SET_POSTS, 
    LOADING_DATA, 
    LIKE_POST, 
    UNLIKE_POST, 
    DELETE_POST, 
    CREATE_POST,
    CLEAR_ERRORS,
    SET_ERRORS,
    LOADING_UI,
    SET_SINGLE_POST,
    STOP_LOADING_UI,
    SUBMIT_COMMENTS,
} from '../types';

import {
    getPostsUrl,
    createAPostUrl
} from '../../urls';
import axios from 'axios';

export const getAllPosts = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(getPostsUrl)
         .then(result => {
             dispatch({
                 type: SET_POSTS,
                 payload: result.data
             });
         })
         .catch(err => {
             console.error(err);
         });
}

export const likePost = (postId) => (dispatch) => {
    const likeAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/${postId}/like`;
    axios.get(likeAPostUrl)
         .then(result => {
             dispatch({
                 type: LIKE_POST,
                 payload: result.data
             });
         })
         .catch(err => {
             console.error(err);
         });
}

export const unlikePost = (postId) => (dispatch) => {
    const unlikeAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/${postId}/unlike`;
    axios.get(unlikeAPostUrl)
         .then(result => {
             dispatch({
                 type: UNLIKE_POST,
                 payload: result.data
             });
         })
         .catch(err => {
             console.error(err);
         })
}

export const deletePost = (postId) => (dispatch) => {
    const deleteAPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/${postId}`;
    axios.delete(deleteAPostUrl)
         .then((result) => {
            dispatch({
                type: DELETE_POST,
                payload: postId
            });
         })
         .catch(err => {
             console.error(err);
         })
}

export const createPost = (newPost) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post(createAPostUrl, newPost)
         .then((result) => {
             dispatch({
                 type: CREATE_POST,
                 payload: result.data
             });
             dispatch(clearErrors());
             //getAllPosts();
         })
         .catch(err => {
             dispatch({
                 type: SET_ERRORS,
                 payload: err.response.data
             });
         });
}

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}

export const getOnePost = (postId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    const getOnePostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/${postId}`;
    axios.get(getOnePostUrl)
         .then(result => {
             dispatch({
                 type: SET_SINGLE_POST,
                 payload: result.data
             });
             dispatch({ type: STOP_LOADING_UI });
         })
         .catch(err => {
             console.error(err);
         });
}

export const commentOnPost = (postId, body) => (dispatch) => {
    const commentOnPostUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/post/${postId}/comment`;
    axios.post(commentOnPostUrl, body)
         .then((result) => {
             dispatch({
                 type: SUBMIT_COMMENTS,
                 payload: result.data
            });
            dispatch(clearErrors());
         })
         .catch(err => {
             console.error(err);
             dispatch({
                 type: SET_ERRORS,
                 payload: err.response.data
             });
         });
}


export const getUserByHandle = (handle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    const getUserByHandleUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/user/${handle}`;
    axios.get(getUserByHandleUrl)
         .then(result => {
             dispatch({
                 type: SET_POSTS,
                 payload: result.data.posts
             });
         })
         .catch(() => {
             dispatch({
                 type: SET_POSTS,
                 payload: null
             });
         });
}