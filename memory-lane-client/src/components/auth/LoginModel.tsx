import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap'
import fblogo from '../../images/login/fblogo.png'
import googleLogo from '../../images/login/googlelogo.png'
import './LoginModel.css';
import {loginUser} from '../../actions/authActions';
import { showRegisterPanel, closeLoginRegisterPanel } from '../../actions/headerActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


function LoginModel(props : any) {
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = (e : any) => {
        e.preventDefault();
        props.loginUser({email, password}, history.push('/'));
    }

    return (
        <div>
          <Modal dialogClassName={"modal-lgn"} show={props.show} centered>
        <Modal.Header>
            <h6>Sign in</h6>
            <span className="closeBtn" onClick={() => props.closeLoginRegisterPanel()}>&#10005;</span>
        </Modal.Header>
        <Modal.Body>
            <div className="other-login">
                <a className="fb-btn mr-1" href="/api/v0/auth/facebook/"><div ><img className="fb-ico" src={fblogo}/><span className="fb-link-style">facebook</span></div></a>
                <a className="google-btn ml-1" href="/api/v0/auth/google/"><div ><img className="google-ico" src={googleLogo}/><span className="google-link-style">google</span></div></a>
            </div>
            <Form onSubmit={(e : any) => login(e)}>
                <Form.Control className="login-field mt-3" type="text" placeholder="username or email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="on" required/>
                <Form.Control className="login-field mt-2 mb-2" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="on" required/>
                <Button className="login-btn mt-3" type="submit">Sign in</Button>
            </Form>
            <div className="text-center mt-2 mb-3">New here?<span className="sign-up-link" onClick={() => { props.showRegisterPanel()}}> Sign up</span></div>
        </Modal.Body>
        </Modal>  
        </div>
        
    )
}

LoginModel.propTypes = {
    loginUser : PropTypes.func.isRequired,
    showRegisterPanel : PropTypes.func.isRequired,
    closeLoginRegisterPanel : PropTypes.func.isRequired
}

export default connect(null, {loginUser, showRegisterPanel, closeLoginRegisterPanel}) (LoginModel);
