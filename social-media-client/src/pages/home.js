import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import Post from '../components/Post';
import Profile from '../components/Profile';
import PostSkeleton from '../components/PostSkeleton';
import { connect } from 'react-redux';
import { getAllPosts } from '../redux/actions/dataActions';

class home extends Component {

    state = {
        posts: []
    }
    componentDidMount(){
        this.props.getAllPosts();
    }
    render() {

        let recentPostMarkup = this.props.loading ? (
            <PostSkeleton />
        ) 
        : (
            this.props.posts.map(post => <Post key={post.postId} post={post} />)
         ) ;
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {recentPostMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    posts: state.data.posts,
    loading: state.data.loading
});

const mapActionsToProps = {
    getAllPosts
}

export default connect(mapStateToProps, mapActionsToProps)(home);
