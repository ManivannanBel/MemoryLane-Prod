import React from 'react'
import editImgStyles from './EditImg.module.css';

function EditImg(props : any) {
    const {index, data} = props;

    const removeImage = () => {
        props.removeImage(index, data.type, );
    }

    return (
        <div>
            <div className={editImgStyles.removeImg} onClick={removeImage}>&#10005;</div>
            <img className={editImgStyles.selectedImg} src={data.url}/>
        </div>
    )
}

export default EditImg
