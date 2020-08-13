import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import MyButton from './MyButton';
import ChatIcon from '@material-ui/icons/Chat';
import DeletePost from './DeletePost';
import PostDetails from './PostDetails';
import LikeButton from './LikeButton';


const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 100,
        maxHeight: 100,
        borderRadius: '50%',
        marginLeft: 20,
        marginTop: 20
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Post extends Component {

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         likeCount: props.post.likeCount
    //     }
    // }

    // componentWillReceiveProps(nextProps){
    //     this.setState({
    //         likeCount: nextProps.post.likeCount
    //     });
    // }

    isCurrentUser = (handle, userHandle) => {
        if(handle === userHandle){
            return true;
        }
        else {
            return false;
        }
    }

    render() {
        dayjs.extend(relativeTime);
        const { 
            classes, 
            post: {
                body, 
                createdAt, 
                userImage, 
                userHandle, 
                postId,  
                commentCount
            },
            user: {
                authenticated,
                credentials: {
                    handle
                }
            }
        } = this.props

        const currentPost = this.props.data.posts.find((post) => post.postId === postId);
        let likeCount;
        if(currentPost){
            likeCount = currentPost.likeCount;
        }
        
        


        const deleteButton = authenticated ? (
            this.isCurrentUser(handle, userHandle) ? (
                // <MyButton
                //     toolTipTitle="Delete this Post"
                //     onClickFunction={this.deleteAPost}
                // >
                //     <DeleteIcon color="secondary" />
                // </MyButton>
                <DeletePost postId={postId} />
            ): null
        ) : null;

        return (
            <Card className={classes.card}>
                <CardMedia 
                    image={userImage}
                    titel="Profile Image"
                    className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/users/${userHandle}`}
                        color="primary"
                    >{userHandle}</Typography>
                    <Typography 
                        variant="body2" 
                        color="textSecondary"
                    >{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton postId={postId} />
                    <span>{likeCount} Likes</span>
                    <MyButton 
                        toolTipTitle="comments" 
                    >
                        <ChatIcon color="secondary"/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                    {deleteButton}
                    <PostDetails 
                        postId={postId}
                        userHandle={userHandle}
                        openDialog={this.props.openDialog}
                    />
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
});

const mapActionsToProps = {
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));
