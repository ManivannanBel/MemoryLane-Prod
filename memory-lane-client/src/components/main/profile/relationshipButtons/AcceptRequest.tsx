import React from 'react'
import {Button} from 'react-bootstrap';
import profileStyles from '../Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock, faUserTimes } from '@fortawesome/free-solid-svg-icons';

function AcceptRequest(props : any) {
    return (
        <React.Fragment>
            <div className={profileStyles.frndRqSnt}><strong>{props.firstname}</strong> has sent you a friend request</div>
            <div className={profileStyles.frndRqSnt}>
                <Button className={`${profileStyles.frndReqBtn} mr-2`} onClick={props.acceptFriendRequest}>Accept&nbsp;<FontAwesomeIcon icon={faUserClock} color={'white'}/></Button>
                <Button className={profileStyles.frndReqBtn} onClick={props.rejectRequest}>Reject&nbsp;<FontAwesomeIcon icon={faUserTimes} color={'white'}/></Button>
            </div>
        </React.Fragment>
    )
}

export default AcceptRequest
