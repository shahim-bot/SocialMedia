import { 
    SET_USER, 
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    SET_UNAUTHENTICATED,
    LOADING_USER,
    MARK_NOTIFICATIONS_READ
} from '../types';

import {
    loginUrl,
    signupUrl,
    getUserUrl,
    uploadImageUrl,
    markNotificationsReadUrl,
    updateUserDetailsUrl
} from '../../urls';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI});
    axios.post(loginUrl, userData)
            .then(result => {
                const FBIdToken = `Bearer ${result.data.token}`;
                localStorage.setItem('FBIdToken', `Bearer ${result.data.token}`);
                axios.defaults.headers.common['Authorization'] = FBIdToken;
                dispatch(getUserData());
                dispatch({ type: CLEAR_ERRORS});
                history.push('/');
            })
            .catch(err => {
                dispatch({ 
                    type: SET_ERRORS,
                    payload: err.response.data
                });
            });

}

export const signupUser = (neUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI});
    axios.post(signupUrl, neUserData)
            .then(result => {
                const FBIdToken = `Bearer ${result.data.token}`;
                localStorage.setItem('FBIdToken', `Bearer ${result.data.token}`);
                axios.defaults.headers.common['Authorization'] = FBIdToken;
                dispatch(getUserData());
                dispatch({ type: CLEAR_ERRORS});
                history.push('/');
            })
            .catch(err => {
                dispatch({ 
                    type: SET_ERRORS,
                    payload: err.response.data
                });
            });

}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
}

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get(getUserUrl)
         .then(result => {
             dispatch({
                 type: SET_USER,
                 payload: result.data
             });
         })
         .catch(err => {
             console.error(err);
         })
}

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post(uploadImageUrl, formData)
         .then(() => {
             dispatch(getUserData());
         })
         .catch(err => {
             console.log(err);
         });
}

export const editUserDetails = (userData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post(updateUserDetailsUrl, userData)
         .then(() => {
            dispatch(getUserData());
         })
         .catch(err => {
             console.error(err);
         });
}

export const markNotificationsRead = (notificationIds) => (dispatch) => {
    axios.post(markNotificationsReadUrl, notificationIds)
         .then(result => {
             dispatch({
                 type: MARK_NOTIFICATIONS_READ
             });
         })
         .catch(err => {
             console.error(err);
         });
}
