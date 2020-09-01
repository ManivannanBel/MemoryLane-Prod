import React from 'react'
import Profile from './profile/Profile'
import Header from '../header/Header'
import { Container } from 'react-bootstrap';
import PersonalMemoryLane from './personalMemoryLane/PersonalMemoryLane';

function Main() {
    return (
        <div>
          <Container>
            <Profile/>
            <PersonalMemoryLane/>
          </Container>  
        </div>
    )
}

export default Main
