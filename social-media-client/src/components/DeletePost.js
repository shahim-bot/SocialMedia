import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from './MyButton';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { connect } from 'react-redux';
import { deletePost } from '../redux/actions/dataActions';

const styles = {
    deleteButton:{
        position: 'absolute',
        top: '10%',
        left: '90%'
    }
};

class DeletePost extends Component {

    constructor(){
        super();
        this.state = {
            open: false
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.deleteAPost = this.deleteAPost.bind(this);
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    deleteAPost = () => {
        this.props.deletePost(this.props.postId);
        this.setState({
            open: false
        });
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton
                     toolTipTitle="Delete this Post"
                     onClickFunction={this.handleOpen}
                     buttonClass={classes.deleteButton}
                >
                    <DeleteIcon color="secondary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this post ?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteAPost} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

const mapActionsToProps = {
    deletePost
};

export default connect(null, mapActionsToProps)((withStyles(styles)(DeletePost)));
