import React from 'react'
import ImgStyles from './Img.module.css';

function Img(props : any) {
    //console.log(JSON.parse(props.img).url);
    //console.log((props.img));
    return (
        <div>
             <img className={ImgStyles.image} style={{width : '600px', height : '400px'}} src={props.img} alt="" draggable="false"/>
        </div>
    )
}

export default Img
