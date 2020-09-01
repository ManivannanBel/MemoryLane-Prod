import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/main/Main';
import store from './store';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/header/Header';
import MemoryLane from './components/main/memoryLane/MemoryLane';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logout } from "./actions/authActions";
import ProtectedRoute from './utils/ProtectedRoute';

//Check for token
if(localStorage.jwtToken){
  //set auth token
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user data
  const decoded : any = jwt_decode(localStorage.jwtToken);
  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  //Check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    //Logout user
    store.dispatch(logout());
    //store.dispatch(setCurrentUser({}));
    //Clear data
    window.location.href = "/";
  }
}

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
        <Header/>
        <Route exact path="/" component={MemoryLane}/>
        {/* <Route exact path="/:username" component={Main}/> */}
        <Switch>
          <ProtectedRoute exact path="/:username" component={Main}/>
        </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
