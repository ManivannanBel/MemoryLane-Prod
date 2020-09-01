import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import { } from '../../actions/types';
import { registerUser } from '../../actions/authActions';
import { closeLoginRegisterPanel } from '../../actions/headerActions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./RegisterModel.css"

function RegisterModel(props : any) {

    const history = useHistory(); 

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerUser = () => {
        const newUser = {
            email,
            username,
            password,
            confirmPassword
        }
        props.registerUser(newUser, history);
    }

    return (
        <div>
           <Modal dialogClassName="modal-lgn" show={props.show} centered>
        <Modal.Header>
            <h6>Sign up</h6>
            <span className="closeBtn" onClick={() => props.closeLoginRegisterPanel()}>&#10005;</span>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={registerUser}>
                <Form.Control className="login-field mt-2" type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                <Form.Control className="login-field mt-2" type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required/>
                <Form.Control className="login-field mt-2 mb-2" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                <Form.Control className="login-field mt-2 mb-2" type="password" placeholder="confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
                <div className="text-center ml-3 mt-3 privacy-container"><input className="cb mr-1" type="checkbox" required/><p>I agree to the</p><span className="ml-1 to-privacy-terms">terms of service</span></div>
                <Button className="login-btn mb-3" type="submit">Register</Button>
            </Form>
        </Modal.Body>
        </Modal> 
        </div>
    )
}

RegisterModel.propTypes = {
    registerUser : PropTypes.func.isRequired,
    closeLoginRegisterPanel : PropTypes.func.isRequired
}

export default connect(null, {registerUser, closeLoginRegisterPanel}) (RegisterModel);
