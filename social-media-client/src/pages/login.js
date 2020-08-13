import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import AppIcon from '../images/soviet-union.JPG';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';


const styles = {
    form : {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 10px auto',
        height: '50px',
        width: '50px',
        borderRadius: '10px'
    },
    pageTitle: {
        margin: '0px auto 20px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        position: 'relative'
    },
    customError: {
        marginTop: '10px',
        color: 'red',
        fontSize: '1.0rem'
    },
    progress: {
        position: 'absolute'
    }
};

class login extends Component {

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this); 
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {} 
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        }
    }

    handleSubmit(event){
        event.preventDefault();
        
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history);
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name] : value
        });
    }

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid 
                container
                className={classes.form}
            >
                <Grid item sm></Grid>
                <Grid item sm>
                    <img 
                        src={AppIcon} 
                        alt="App Logo"
                        className={classes.image} 
                    />
                    <Typography 
                        variant="h3"
                        className={classes.pageTitle}
                        color="primary"
                    >
                        Login
                    </Typography>
                    <form
                        noValidate
                        onSubmit={this.handleSubmit}
                    >
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            className={classes.textField}
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth
                            variant="outlined"
                            helperText={errors.email}
                            error={errors.email ? true : false}
                        />
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            className={classes.textField}
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                            variant="outlined"
                            helperText={errors.password}
                            error={errors.password ? true : false}
                        />
                        {errors.general && (
                            <Typography
                                variant="body2"
                                className={classes.customError}
                            >
                                {errors.general}
                            </Typography>
                        )}
                        <Button 
                            type="submit"
                            variant="contained"
                            className={classes.button}
                            color="primary"
                            disabled={loading}
                        >Login
                        {loading && (
                            <CircularProgress 
                                size={20} 
                                className={classes.progress} 
                                color="secondary"
                            />
                        )}
                        </Button>
                        <br />
                        <small>Don't have an account yet? Sign up
                            <Link to="/signup"> here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));  
