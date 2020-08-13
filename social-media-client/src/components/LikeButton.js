import React, { Component } from 'react'
import MyButton from './MyButton';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';
import { Link } from 'react-router-dom';

class LikeButton extends Component {

    likedPost = () => {
        if(
            this.props.user.likes &&
            this.props.user.likes.find((like) => like.postId === this.props.postId)
        ){
            return true;
        }
        else{
            return false;
        }
    }

    likeAPost = () => {
        this.props.likePost(this.props.postId);
    }

    unlikeAPost = () => {   
        this.props.unlikePost(this.props.postId);
    }


    render() {

        const {
            user: {
                authenticated
            }
        } = this.props;
        
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton toolTipTitle="Like">
                    <FavoriteBorder color="secondary" />
                </MyButton>
            </Link>
        ) : (
            this.likedPost() ? (
                <MyButton toolTipTitle="Unlike" onClickFunction={this.unlikeAPost}>
                    <FavoriteIcon color="secondary" />
                </MyButton>
            ) : (
                <MyButton toolTipTitle="Like" onClickFunction={this.likeAPost}>
                    <FavoriteBorder color="secondary" />
                </MyButton>
            )
        );
        return likeButton;
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
});

const mapActionsToProps = {
    likePost,
    unlikePost
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
