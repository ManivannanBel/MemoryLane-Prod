import React, { useState, useEffect, StrictMode } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import {
  Navbar,
  NavDropdown,
  Form,
  Button,
  Nav,
  FormControl,
  Dropdown
} from "react-bootstrap";
import headerStyles from "./Header.module.css";
import LoginModel from "../auth/LoginModel";
import RegisterModel from "../auth/RegisterModel";
import { fetchUserData, logout } from "../../actions/authActions";
import {
  showLoginPanel,
  showRegisterPanel,
  getHeaderDetails
} from "../../actions/headerActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import UserImg from "./UserImg";
import SearchBar from "./SearchBar";

const Header = (props: any) => {
  //const {username} = useParams();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  

  useEffect(() => {}, []);

  useEffect(() => {
    if (props.auth.isAuth) {
      setUsername(props.auth.username);
      props.getHeaderDetails(props.auth.username);
    }
  }, [props.auth.username]);

  useEffect(() => {
    if (props.auth.isAuth) {
      setProfileImage(props.profileImage);
    }
  }, [props.profileImage]);

  useEffect(() => {
    
      setShowLoginModal(props.headerState.showLoginPanel);
      setShowSignUpModal(props.headerState.showRegisterPanel);
    
  }, [props.headerState]);

  
  const showSignin = () => {
    props.showLoginPanel();
  };

  const showSignUp = () => {
    props.showRegisterPanel();
  };

  const renderHeader = () => {
    if (!props.auth.isAuth) {
      return (
        <React.Fragment>
          <Nav className="mr-auto">
          </Nav>
          <Button
            variant="outline-primary"
            className={headerStyles.signinButton}
            onClick={() => showSignin()}
          >
            Sign in
          </Button>
          <Button
            variant="outline-primary"
            className={headerStyles.signinButton}
            onClick={() => showSignUp()}
          >
            Sign up
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Nav className="mr-auto">
            <SearchBar />
          </Nav>
          <Link className={headerStyles.Userlink} to={`/${username}`}>
            <UserImg img={profileImage} />
            <div className={headerStyles.uName}>{username}</div>
          </Link>
          <Button
            variant="outline-primary"
            className={headerStyles.signinButton}
            onClick={(e: any) => props.logout()}
          >
            Sign out
          </Button>
        </React.Fragment>
      );
    }
  };

  return (
    <React.Fragment>
      <div className={headerStyles.header}>
        <Navbar bg="light" variant="light">
          <Link to="/">
            <Navbar.Brand href="" className={headerStyles.logo}>
              Memory lane
            </Navbar.Brand>
          </Link>
          
          {renderHeader()}
        </Navbar>
      </div>
      <LoginModel show={showLoginModal} />
      <RegisterModel show={showSignUpModal} />
    </React.Fragment>
  );
};

Header.propTypes = {
  fetchUserData: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  //getProfileImage : PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profileImage: PropTypes.string.isRequired,
  showLoginPanel: PropTypes.func.isRequired,
  showRegisterPanel: PropTypes.func.isRequired,
  headerState: PropTypes.object.isRequired,
  getHeaderDetails: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  profileImage: state.header.profileImage,
  //username : state.header.username,
  headerState: state.header
});

export default connect(mapStateToProps, {
  fetchUserData,
  logout,
  showLoginPanel,
  showRegisterPanel,
  getHeaderDetails
})(Header);
