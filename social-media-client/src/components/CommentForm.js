import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { commentOnPost } from '../redux/actions/dataActions';


const styles = {
    visibleSeperator: {
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    },
    progress: {
        position: 'absolute'
    },
    submitButton:{
        position: 'relative',
        margin: 20
    }
};


class CommentFrom extends Component {

    constructor(){
        super();
        this.state = {
            body: '',
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body: ''
            });
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.commentOnPost(this.props.postId, {body: this.state.body});
    }

    render() {
        const { 
            classes, 
            authenticated,
        } = this.props;
        const errors = this.state.errors;
        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Post a Comment"
                        error={errors.comment ? true : false}
                        helpertext={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        className={classes.submitButton}
                    >Post
                    </Button>
                </form>
                <hr className={classes.visibleSeperator} />
            </Grid>
        ) : null;
        return commentFormMarkup;
    }
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

const mapActionsToProps = {
    commentOnPost
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentFrom))
