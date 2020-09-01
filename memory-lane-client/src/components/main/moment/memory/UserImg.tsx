import React from 'react'
import userImgStyles from './UserImg.module.css';

function UserImg(props : any) {
    return (
        <React.Fragment>
           <img className={userImgStyles.img} src={props.src}/> 
        </React.Fragment>
    )
}

export default UserImg
