import { 
    SET_POSTS, 
    LOADING_DATA, 
    LIKE_POST, 
    UNLIKE_POST, 
    DELETE_POST, 
    CREATE_POST,
    SET_SINGLE_POST,
    SUBMIT_COMMENTS
} from '../types';

const initialState = {
    posts: [],
    singlePost: {},
    loading: false
};

export default function(state=initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };

        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };

        case LIKE_POST:
            let index = state.posts.findIndex((post) => post.postId === action.payload.postId);
            let postArray1 = [...state.posts];
            postArray1[index] = action.payload;
            let single1
            if(state.singlePost.postId === action.payload.postId){
                single1 = action.payload;
                single1.comments = state.singlePost.comments;
            }
            else{
                single1 = {
                    ...state.singlePost
                };
            }
            return {
                ...state,
                posts: postArray1,
                singlePost: single1
            }

        case UNLIKE_POST:
            let index1 = state.posts.findIndex((post) => post.postId === action.payload.postId);
            let postArray2 = [...state.posts];
            postArray2[index1] = action.payload;
            let single2;
            if(state.singlePost.postId === action.payload.postId){
                single2 = action.payload;
                single2.comments = state.singlePost.comments
            }
            else{
                single2 = {
                    ...state.singlePost
                };
            }
            return {
                ...state,
                posts: postArray2,
                singlePost: single2
            }

        case DELETE_POST:
            // let index2 = state.posts.findIndex((post) => post.postId === action.payload);
            // state.posts.splice(index2, 1);
            let modifyPost = [...state.posts];
            modifyPost = modifyPost.filter((post) => post.postId !== action.payload);
            return {
                ...state,
                posts: modifyPost
            };

        case CREATE_POST:
            let listOfPosts = [
                action.payload,
                ...state.posts
            ];
            return{
                ...state,
                posts: listOfPosts
            };

        case SET_SINGLE_POST:
            let onePost = action.payload;
            return {
                ...state,
                singlePost: onePost
            };

        case SUBMIT_COMMENTS: 
            let newAddedCommentsArray = [action.payload, ...state.singlePost.comments];
            let newCommentCount = state.singlePost.commentCount + 1;
            let submitCommentIndex = state.posts.findIndex((post) => post.postId === action.payload.postId);
            let updatedPostsArray = [...state.posts];
            updatedPostsArray[submitCommentIndex].commentCount = newCommentCount;
            return {
                ...state,
                posts: updatedPostsArray,
                singlePost: {
                    ...state.singlePost,
                    commentCount: newCommentCount,
                    comments: newAddedCommentsArray
                }
            };
        
        default:
            return state;
    }
}