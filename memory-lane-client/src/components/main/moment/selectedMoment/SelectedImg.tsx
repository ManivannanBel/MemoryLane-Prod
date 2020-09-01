import React, { useState, useEffect, useRef } from 'react'
import selectedImgStyles from './SelectedImg.module.css';

function SelectedImg(props : any) {

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState('');

    const imgRef = useRef();

    useEffect(() => {
        setFile(props.image);
        console.log(imgRef.current);
        return () => {
            // if(imgRef != undefined && imgRef.current != undefined )
            //     (imgRef as any).current.remove();
        }
        // (imgRef as any).current = `<img ref={imgRef} className={selectedImgStyles.selectedImg} src={file} alt="" onLoad={e => setLoading(false)}/>`;
        console.log(imgRef)
    }, [props.image]);

    return (
        <div className={selectedImgStyles.container}>
            <img ref={imgRef} className={selectedImgStyles.selectedImg} src={file} alt="" onLoad={e => setLoading(false)}/>
            {loading &&
                <div className="img-plh" />}
        </div>
    )
}

export default SelectedImg
