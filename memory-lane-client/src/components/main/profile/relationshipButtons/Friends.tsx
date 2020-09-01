import React, { useState } from 'react'
import {Button} from 'react-bootstrap';
import profileStyles from '../Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

function Friends(props : any) {
    const [showOpts, setShowOpts] = useState(false);
    return (
        <div className={profileStyles.relStsBtnWrpr}>
            <Button className={profileStyles.frndReqBtn} onClick={() => setShowOpts(!showOpts)}>Friends&nbsp;<FontAwesomeIcon icon={faUserFriends} color={'white'}/></Button>
            {showOpts &&
                <div className={profileStyles.relBtnDrpDwn}>
                    <div className={profileStyles.relOpts} onClick={() => props.unfriend()}>Unfriend</div>
                    <div className={profileStyles.relOpts} onClick={() => props.block()}>Block</div>
                </div>
            }
        </div>
    )
}

export default Friends;
