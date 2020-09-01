import React from 'react'
import selectedImagesStyles from './SelectedImages.module.css';

function SelectedImage(props : any) {
    const {index, url} = props;

    const removeImage = () => {
        props.removeImage(index);
    }

    return (
        <div>
            <div className={selectedImagesStyles.removeImg} onClick={removeImage}>&#10005;</div>
            <img className={selectedImagesStyles.selectedImg} src={url}/>
        </div>
    )
}

export default SelectedImage
