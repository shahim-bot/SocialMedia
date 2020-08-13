import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react'
import PropTypes from 'prop-types';

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route 
        {...rest}
        render={(props) =>
                     authenticated === true ? <Redirect to="/" /> : 
                     <Component {...props} />
                }
    />
);

const mapStateToProps = (state) => ({
    user: state.user.authenticated
});

AuthRoute.propTypes = {
    user: PropTypes.object
}

export default connect(mapStateToProps)(AuthRoute);
