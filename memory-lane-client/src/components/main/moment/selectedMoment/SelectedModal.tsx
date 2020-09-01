import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import SelectedMoment from './SelectedMoment';
import selectedModalStyles from './SelectedModal.module.css';
import MeatballIco from '../momentMenu/MeatballIco';
import DropdownMenuMoment from '../momentMenu/DropdownMenuMoment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function SelectedModal(props : any) {
    const [show, setShow] = useState(false);
    const [owned, setOwned] = useState(false);

    useEffect(() => {
        console.log(props.authUName);
        setOwned((props.authUName === props.moment.owner.username));
    }, [props.authUName])
    
    useEffect(() => {
         setShow(props.show);   
    }, [props])

    return (
        <Modal className={selectedModalStyles.selectedModel} show={show} centered>
            <div className={selectedModalStyles.trBtnWrpr}>
                <div className={selectedModalStyles.drpdwn}>
                    <DropdownMenuMoment moment={props.moment} owned={owned}/>
                </div>
                <span className={selectedModalStyles.closeBtn} onClick={props.closeMoment}>&#10005;</span>
            </div>
            <SelectedMoment moment={props.moment}/>
        </Modal>
    )
}

SelectedModal.propTypes = {
    authUName : PropTypes.string.isRequired
}

const mapStateToProps = (state : any) => ({
    authUName : state.auth.username
});

export default connect(mapStateToProps, {}) (SelectedModal)
