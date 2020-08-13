import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { editUserDetails } from '../redux/actions/userActions';
import EditIcon from '@material-ui/icons/Edit';
import MyButton from './MyButton';


const styles = (theme) => ({
    button: {
        float: 'right'
    }
});


class EditDetails extends Component {

    constructor(){
        super()
        this.state = {
            bio: '',
            location: '',
            website: '',
            open: false
        };
        this.handleOpenClick = this.handleOpenClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.mapUserDetailsToState = this.mapUserDetailsToState.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleOpenClick = () => {
        const credentials = this.props.user.credentials
        this.mapUserDetailsToState(credentials)
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    handleSave = (event) => {
        event.preventDefault();
        const userData = {
            bio: this.state.bio,
            location: this.state.location,
            website: this.state.website
        };
        this.props.editUserDetails(userData);
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            location: credentials.location ? credentials.location : '',
            website: credentials.website ? credentials.website : '',
        });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }
    render() {

        const { classes } = this.props;
        return (
            <div>
                <MyButton
                    toolTipTitle="Edit Profile"
                    onClickFunction={this.handleOpenClick}
                    buttonClass={classes.button}
                >
                    <EditIcon color="primary" />
                </MyButton>
                <Dialog 
                    open={this.state.open} 
                    onClose={this.handleClose} 
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Edit details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the details you want to Edit.
                        </DialogContentText>
                        <form>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="bio"
                            name="bio"
                            label="Bio"
                            type="text"
                            multiline
                            placeholder="A short description about yourself"
                            value={this.state.bio}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="location"
                            name="location"
                            label="Location"
                            type="text"
                            placeholder="Where you Live?"
                            value={this.state.location}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="website"
                            name="website"
                            label="Website"
                            type="text"
                            placeholder="Add a link to your personal/prfessional website"
                            value={this.state.website}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        </form>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={this.handleSave} color="primary">
                        Save
                      </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    editUserDetails
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));
