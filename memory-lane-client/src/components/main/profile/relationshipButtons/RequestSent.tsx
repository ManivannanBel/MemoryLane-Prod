import React from 'react'
import {Button} from 'react-bootstrap';
import profileStyles from '../Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock } from '@fortawesome/free-solid-svg-icons';

function RequestSent(props : any) {
    return (
        <Button className={profileStyles.frndReqBtn}>Request sent&nbsp;<FontAwesomeIcon icon={faUserClock} color={'white'}/></Button>
    )
}

export default RequestSent
