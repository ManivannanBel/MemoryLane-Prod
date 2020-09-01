import React, {useEffect, useState} from 'react'
import { Modal } from 'react-bootstrap';
import selectedModalStyles from './EditMomentModal.module.css';
import EditSelectedMoment from './EditSelectedMoment';

function EditMomentModal(props : any) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(props.show);   
   }, [props])
   
    return (
        <Modal backdropClassName={selectedModalStyles.backdrop} className={selectedModalStyles.selectedModel} show={show} centered>
            <div className={selectedModalStyles.trBtnWrpr}>
                <span className={selectedModalStyles.closeBtn} onClick={e => props.setShowEditPanel(false)}>&#10005;</span>
            </div>
            <EditSelectedMoment moment={props.moment} setShow={props.setShowEditPanel}/>            
        </Modal>
    )
}

export default EditMomentModal
