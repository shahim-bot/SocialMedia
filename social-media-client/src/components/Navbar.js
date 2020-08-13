import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import MyButton from './MyButton';
import CreatePost from './CreatePost';
import Notifications from './Notifications';
import '../App.css';

//Material UI imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';
import HomeIcon from '@material-ui/icons/Home';


class Navbar extends Component {
    render() {
        const authenticated = this.props.user.authenticated;
        console.log(authenticated);
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    
                    {
                        authenticated ?
                        <Fragment>
                            <CreatePost />
                            <Link to="/">
                            <MyButton 
                                toolTipTitle="Home"    
                            >
                                <HomeIcon/>
                            </MyButton>
                            </Link>
                            <Notifications />       
                        <Button color="inherit" onClick={this.props.logoutUser}>Logout</Button>
                        </Fragment> 
                        :
                        <Fragment>
                            <Link to="/">
                            <MyButton 
                                toolTipTitle="Home"    
                            >
                                <HomeIcon />
                            </MyButton>
                            </Link>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </Fragment>
                    }
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    logoutUser
};

export default connect(mapStateToProps, mapActionsToProps)(Navbar)
