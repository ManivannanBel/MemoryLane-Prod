import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SelectedImg from './SelectedImg';
import selectedMomentStyles from './SelectedMoment.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowAltCircleLeft, faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import Memories from '../memory/Memories';
import momentReducer from '../../../../reducers/momentReducer';
import MeatballIco from '../momentMenu/MeatballIco';



function SelectedMoment(props : any) {
    const {id, title, description, files, owner} = props.moment;
    const [currentFile, setCurrentFile] = useState(0);
    console.log(files.length);

    const right = () => {
        if(currentFile < files.length) {
            setCurrentFile(currentFile + 1);
        }
    }

    const left = () => {
        if(currentFile > 0){
            setCurrentFile(currentFile - 1);
        }
    }

    const generateImages = (currentFile : number) => {
        console.log(currentFile);
        return (<SelectedImg image={files[currentFile]} />)
    }

    return (
        <div className={selectedMomentStyles.selectedMoment}>
            <Row>
                <Col md={7} className={selectedMomentStyles.clMoment}>
                    <div className={selectedMomentStyles.lftCov}>
                    <Link to={owner.username} className={'no-a'}>
                    <div className={selectedMomentStyles.imgFNameCont}>
                        <img src={owner.profilePic} className={selectedMomentStyles.profPicSm} />
                        <div className={selectedMomentStyles.uname}>
                             &nbsp;{`${owner.firstname} ${owner.lastname}`}
                        </div>
                    </div>
                    </Link>
                    <div className={selectedMomentStyles.imgNav}>
                        {currentFile > 0 && 
                            <FontAwesomeIcon className={selectedMomentStyles.lAr} icon={faArrowAltCircleLeft} onClick={e => left()}/>}
                        {currentFile < (files.length - 1) && 
                            <FontAwesomeIcon className={selectedMomentStyles.rAr} icon={faArrowAltCircleRight} onClick={e => right()}/>}
                    </div>
                        {/* {<SelectedImg image={files[currentFile]}/>}  */}
                        {generateImages(currentFile)}
                    </div>               
                </Col>
                <Col md={5} className={selectedMomentStyles.crMoment}>
                    <div className={selectedMomentStyles.rw1Ht}>
                        <div className={selectedMomentStyles.title}>
                            {title}
                        </div>
                        <div className={selectedMomentStyles.desc}>
                            {description}
                        </div>
                    </div>
                    <div className={selectedMomentStyles.rw2Ht}>
                        <Memories momentId={id}/>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default SelectedMoment
