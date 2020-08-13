import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MyButton from './MyButton';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { createPost, clearErrors } from '../redux/actions/dataActions';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
    submitButton: {
        position: 'relative'
    },
    progressSpinner: {
        position: 'absolute'
    },
    customError:{
        color: "red"
    }
};

class CreatePost extends Component {

    constructor(){
        super();
        this.state = {
            open: false,
            body: '',
            errors: {}
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createAPost = this.createAPost.bind(this);

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ 
                body: '',
                errors: {},
                open: false
        });
        }
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.props.clearErrors();
        this.setState({
            open: false,
            errors: {}
        });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    createAPost = (event) => {
        event.preventDefault();
        const newPost = {
            body: this.state.body
        }
        this.props.createPost(newPost);
    }

    render() {

        const { errors } = this.state;
        const { classes, UI: { loading }} = this.props;

        return (
            <Fragment>
                <MyButton 
                    toolTipTitle="Write a Post"  
                    onClickFunction={this.handleOpen} 
                >
                <AddIcon/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle id="form-dialog-title">
                        Create a Post
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Write about something on your mind.
                        </DialogContentText>
                        <form>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="body"
                            name="body"
                            label="Body"
                            type="text"
                            multiline
                            placeholder="Describe your thought"
                            value={this.state.body}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        {errors.body && (
                            <Typography
                                variant="body2"
                                className={classes.customError}
                            >
                                {errors.body}
                            </Typography>
                        )}

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleClose}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.createAPost}
                            color="primary"
                            variant="outlined"
                            disabled={loading}
                            className={classes.submitButton}
                        >
                            {loading && (
                                <CircularProgress 
                                    size={20}
                                    className={classes.progressSpinner}
                                    color="secondary"
                                />
                            )}
                            Post
                        </Button>
                        
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    UI: state.UI
});

const mapActionsToProps = {
    createPost,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CreatePost));
