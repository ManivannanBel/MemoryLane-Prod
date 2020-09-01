import React, { useState, useEffect} from 'react'
import { Row, Col } from 'react-bootstrap';
import selectedImagesStyles from './SelectedImages.module.css';
import SelectedImage from './SelectedImage';

function SelectedImages(props : any) {

    const images = props.images;

    const renderImages = () => {
        const requiredRows : number = images.length / 5;
        const rows = [];
        let pointer = 0;
        for(let r = 0; r < requiredRows; r++){
            const cols = [];
            for(let c = 0; c < 5; c++){
                cols.push(<Col key={pointer}>{images[pointer] && <SelectedImage index={pointer} url={URL.createObjectURL(images[pointer])} removeImage={props.removeImage}/>}</Col>);
                pointer++;
            }
            rows.push(<Row key={r} className='mb-4'> {cols} </Row>);
        }

        return (
            <div>
                {rows}
            </div>
        )
    }

    return (
        <div>
            {renderImages()}
        </div>
    )
}

export default SelectedImages
