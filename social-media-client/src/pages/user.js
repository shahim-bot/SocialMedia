import React, { Component } from 'react';
import { getUserByHandle } from '../redux/actions/dataActions';
import { connect } from 'react-redux';
import axios from 'axios';
import Post from '../components/Post';
import AnyUserProfile from '../components/AnyUserProfile';
import Grid from '@material-ui/core/Grid';
import PostSkeleton from '../components/PostSkeleton';
import ProfileSkeleton from '../components/ProfileSkeleton';

class user extends Component {

    constructor(){
        super();
        this.state = {
            userProfile: null,
            postIdParameter: null
        };
    }

    componentDidMount = () => {
        const handle = this.props.match.params.handle;
        const postIdFromUrl = this.props.match.params.postId;
        if(postIdFromUrl){
            this.setState({
                postIdParameter: postIdFromUrl
            });
        }
        this.props.getUserByHandle(handle);
        const getUserByHandleUrl = `https://us-central1-socialmedia954-8cbb0.cloudfunctions.net/api/user/${handle}`;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        axios.get(proxyurl+getUserByHandleUrl)
             .then((result) => {
                this.setState({
                    userProfile: result.data.user
                });
                console.log(this.state.userProfile);
                console.log(result.data);
             })
             .catch(err => {
                 console.error(err);
             });
    }

    render() {

        const {
            posts,
            loading
        } = this.props.data;

        const { postIdParameter } = this.state;

        const PostMarkup = loading ? 
            (
                <PostSkeleton />
            ) : posts === null ? (
            (
                <p>No Posts posted by this User</p>
            )
            ) : !postIdParameter ? (
                posts.map(post => <Post key={post.postId} post={post} />)
            ) : (
                posts.map(post => {
                    if(post.postId !== postIdParameter){
                        return <Post key={post.postId} post={post} />
                    }
                    else{
                        return <Post key={post.postId} post={post} openDialog/>
                    }
                })
            );

        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {PostMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.userProfile === null ? (
                        <ProfileSkeleton />
                    ):(
                        <AnyUserProfile profile={this.state.userProfile} />
                    )}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data
});

const mapActionToProps = {
    getUserByHandle
};

export default connect(mapStateToProps, mapActionToProps)(user);
