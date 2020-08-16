import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import MyButton from './MyButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { deleteComment } from '../redux/actions/dataActions';
import Button from '@material-ui/core/Button';

const styles = {
    deleteButton:{
        top: '-90px',
        left: '350px'
    }
};


export class DeleteComment extends Component {

    constructor(){
        super();
        this.state = {
            open: false
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    handleDeleteComment = () =>{
        this.props.deleteComment(this.props.commentId, this.props.data.singlePost.postId);
        this.handleClose();
    }

    render() {
        const {
            classes,
            commentId,
            data:{
                singlePost:{
                postId
            }
        }
    } = this.props;

        return (
            <Fragment>
                <MyButton
                     toolTipTitle="Delete this Comment"
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
                        Are you sure you want to delete this Comment ?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDeleteComment} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data
});

const mapActionsToProps = {
    deleteComment
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(DeleteComment));
