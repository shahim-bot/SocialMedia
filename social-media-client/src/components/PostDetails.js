import React, { Component, Fragment } from 'react'
import MyButton from './MyButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import dayjs from 'dayjs';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { getOnePost, clearErrors } from '../redux/actions/dataActions';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import LikeButton from './LikeButton';
import ChatIcon from '@material-ui/icons/Chat';
import Comments from './Comments';
import CommentForm from './CommentForm';



const styles = {
    invisibleSeperator:{
        border: 'none',
        margin: 4
    },
    profilePicture:{
        width: 125,
        height: 125,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    dialogContent: {
        padding: 20,
    },
    closeButton:{
        position: 'absolute',
        left: '90%',
        top: '5%'
    },
    progressButton:{
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    viewDetailsButton: {
        position: 'absolute',
        left: '90%'
    },
    visibleSeperator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    },
    scrollbar: {
        '&::-webkit-scrollbar': {
            width: '0px',
            background: 'transparent'
          }
    }
};

class PostDetails extends Component {

    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen();
        }
    }

    constructor(){
        super();
        this.state = {
            open: false,
            oldPath: '',
            newPath: ''
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen = () => {

        let oldPath = window.location.pathname;
        const { userHandle, postId } = this.props;
        let newPath = `/users/${userHandle}/post/${postId}`;

        window.history.pushState(null,null,newPath);

        if(oldPath === newPath) {
            oldPath = `/users/${userHandle}`;
        }

        this.setState({
            open: true,
            oldPath: oldPath,
            newPath: newPath
        });
        this.props.getOnePost(this.props.postId);
    }

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({
            open: false
        });
        this.props.clearErrors();
    }

    render() {

        const { 
            classes,
            postId, 
            userHandle, 
            singlePost: { 
                body, 
                likeCount, 
                commentCount, 
                createdAt, 
                userImage,
                comments
            },
            UI: {
                loading
            }
        } = this.props;

        // const currentPost = this.props.data.posts.find((post) => post.postId === postId);
        // let likeCount;
        // if(currentPost){
        //     likeCount = currentPost.likeCount;
        // }

        const detailsMarkup = loading ? (
            <div className={classes.progressButton}>
            <CircularProgress size={100} color="secondary" thickness={2}/>
            </div>
        ) : (
            <div className={classes.scrollbar}>
            <Grid container spacing={10}>
                <Grid item sm={3}>
                    <img src={userImage} className={classes.profilePicture} />
                </Grid>
                {/* <Grid sm={1}></Grid> */}
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        variant="h5"
                        color="primary"
                        to={`/users/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant="body1" >
                        {body}
                    </Typography>
                    <LikeButton postId={postId} />
                    <span>{likeCount} Likes</span>
                    <MyButton 
                        toolTipTitle="comments" 
                    >
                        <ChatIcon color="secondary"/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                </Grid>
                <hr className={classes.visibleSeperator} />
                <CommentForm postId={postId} />
                <Comments comments={comments} />
            </Grid>
            </div>
        )

        return (
            <Fragment>
                <MyButton
                    onClickFunction={this.handleOpen}
                    toolTipClass={classes.viewDetailsButton}
                    toolTipTitle="View Details"
                >
                    <UnfoldMore color="secondary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <MyButton
                        toolTipTitle="Close"
                        onClickFunction={this.handleClose}
                        toolTipClass={classes.closeButton}
                    >
                        <CloseIcon color="secondary" />
                    </MyButton>
                    <DialogContent 
                        className={classes.dialogContent}
                    >
                        {detailsMarkup}
                    </DialogContent>

                </Dialog>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    singlePost: state.data.singlePost,
});

const mapActionsToProps = {
    getOnePost,
    clearErrors
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDetails));
