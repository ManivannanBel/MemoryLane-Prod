import React, { useState, useEffect } from "react";
import profileImageStyles from "./ProfileImage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { updateProfileImage } from '../../../actions/profileActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function ProfileImage(props: any) {
  //const {profileImage} : {profileImage : string} = props;

  const [src, setSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setSrc(props.profileImage);
  }, [props.profileImage]);

  const onError = () => {
    setSrc(
      "https://firebasestorage.googleapis.com/v0/b/memory-lane-68e6c.appspot.com/o/prodef.png?alt=media&token=8e86bcd7-1651-40db-8dc7-93328e995243"
    );
  };

  const hoverOn = () => {
    if(props.username === props.auth.username)
      setShowOverlay(true);
  };

  const hoverOff = () => {
    setShowOverlay(false);
  };

  const onSelectImg = (event : any) => {
    let imgFile : any = Object.values(event.target.files)[0];
    setImage(imgFile);
    console.log(props.username);
    props.updateProfileImage(props.username, imgFile);
  }

  const renderImage = () => {
    if(src === ''){
      return (
        <div className={`${profileImageStyles.prfImg} ${profileImageStyles.prfsvg}`} onMouseEnter={hoverOn}>
        <FontAwesomeIcon
          icon={faUserCircle}
          color={"#a472ff"}
          size={"10x"}
        />
        </div>);
    }else{
      return (<img
        className={profileImageStyles.prfImg}
        src={src}
        alt=""
        onError={onError}
        onMouseEnter={hoverOn}
      />);
    }
  }

  return (
    <div className={profileImageStyles.cnt}>
      {showOverlay && (
        <div className={profileImageStyles.pIOverlay} onMouseLeave={hoverOff}>
          <div className={profileImageStyles.camCov}>
            <FontAwesomeIcon
              className={profileImageStyles.camIco}
              icon={faCameraRetro}
              color={"#ffffff"}
              size={"5x"}
            />
          </div>
          <input
            className={profileImageStyles.uploadImgInp}
            type="file"
            id="imgProfPic"
            name="file"
            accept="image/*"
            onChange={onSelectImg}
          />
        </div>
      )}
      {renderImage()}
    </div>
  );
}

ProfileImage.propTypes = {
  updateProfileImage : PropTypes.func.isRequired,
  auth : PropTypes.object.isRequired
}

const mapStateToProps = (state : any) =>( {
  auth : state.auth
})

export default connect(mapStateToProps, {updateProfileImage})(ProfileImage);
