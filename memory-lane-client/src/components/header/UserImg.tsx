import React, { useState, useEffect } from 'react'

function UserImg(props : any) {
    const [src, setSrc] = useState('');

    useEffect(() => {
        setSrc(props.img);
    },[props]);
    
    const onError = () => {
        setSrc("https://firebasestorage.googleapis.com/v0/b/memory-lane-68e6c.appspot.com/o/prodef.png?alt=media&token=8e86bcd7-1651-40db-8dc7-93328e995243");
    }

    return (
        <img src={src} style={{width : '40px', height : '40px', borderRadius : '50%', objectFit : 'cover'}} alt="" onError={onError}/>
    )
}

export default UserImg
