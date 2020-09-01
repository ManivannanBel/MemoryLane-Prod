import React from 'react'
import Img from './Img'
import momentImgStyles from './MomentImg.module.css';

function MomentImg(props : any) {
    
    return (
        <div className={momentImgStyles.momentImg} onClick={props.openMoment}>
           <Img img={props.img}/>
        </div>
    )
}

export default MomentImg
