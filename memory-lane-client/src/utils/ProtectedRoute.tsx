import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoute = ({component : Component, auth , ...otherProps} : any) => (
    <Route 
        {...otherProps}
        render = { props =>
            auth.isAuth === true ? (
                <Component {...props} />
            ) 
            :
            (
                <Redirect to='/?do=signin' />
            )
        }
    />
);

ProtectedRoute.propTypes = {
    auth : PropTypes.object.isRequired
}

const mapStateToProps = (state : any) => ({
    auth : state.auth
})

export default connect(mapStateToProps)(ProtectedRoute);