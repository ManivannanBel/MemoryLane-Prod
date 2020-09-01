import React from 'react'
import {Button} from 'react-bootstrap';
import profileStyles from '../Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

function AddFirend(props : any) {
    return (
        <Button className={profileStyles.frndReqBtn} onClick={props.sendFriendRequest}>Add firend&nbsp;<FontAwesomeIcon icon={faUserPlus} color={'white'}/></Button>
    )
}

export default AddFirend
