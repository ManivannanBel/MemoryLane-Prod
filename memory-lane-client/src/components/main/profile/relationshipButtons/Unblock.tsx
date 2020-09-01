import React from 'react'
import {Button} from 'react-bootstrap';
import profileStyles from '../Profile.module.css';

function Unblock(props : any) {
    return (
        <Button className={profileStyles.frndReqBtn} onClick={props.unblock}>Unblock&nbsp;</Button>
    )
}

export default Unblock
