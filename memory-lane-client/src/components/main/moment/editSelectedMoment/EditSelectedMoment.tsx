import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import editSelectedMomentStyles from "./EditSelectedMoment.module.css";
import EditImg from "./EditImg";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateMoment } from '../../../../actions/momentActions';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faImages, faPlus } from '@fortawesome/free-solid-svg-icons';

function EditSelectedMoment(props: any) {
  const { id, owner } = props.moment;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [existingfiles, setExistingFiles] = useState([]);
  const [filesRemoved, setFilesRemoved] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [imageswarning, setImagesWarning] = useState('');
  //const [displayImages, setDisplayImages] = useState([]);

  enum FileType {
    alreadyExisting,
    recentlyAdded
  }

  useEffect(() => {
    setTitle(props.moment.title);
    setDescription(props.moment.description);
    setExistingFiles(props.moment.files);
    //setDisplayImages(props.moment.files);
  },[]);

  useEffect(() => {
    if(updating === false) return;
    console.log('updated');
    setUpdating(false);
    props.setShow(false);
  }, [props.moment]);

  const onImagesSelect = (event : any) => {
    console.log("in onImageSelect");
    console.log(event.target);
    let imageFiles : File[] = Object.values(event.target.files);
    //console.log(JSON.stringify(imageFiles));
    imageFiles = newImages.concat(imageFiles);

    if((imageFiles.length + existingfiles.length) > 10){
      imageFiles = imageFiles.slice(0, 10);
      setImagesWarning('maximum 10 photos are allowed per moment');
    }
    //console.log(imageFiles);
    setNewImages(imageFiles);
    console.log(imageFiles);
    //setDisplayImages([...existingfiles, ...(imageFiles.map((file : File) => URL.createObjectURL(file)))]);
  }

  const removeImage = (index : number, type : number) => {
    if(type === FileType.alreadyExisting){
      filesRemoved.push(existingfiles[index]);
      setFilesRemoved(filesRemoved);
      let tImage = existingfiles.slice();
      tImage.splice(index, 1);
      setExistingFiles(tImage);
    }else{
      let tImage = newImages.slice();
      tImage.splice(index, 1);
      setNewImages(tImage);
    }
      //setDisplayImages([...tImage, ...newImages]);
  }

  const onUpdate = (e : any) => {
    console.log('on update');
    setUpdating(true);
    e.preventDefault();
    console.log(filesRemoved);
    console.log(Array.isArray(filesRemoved));
    const updated = {
      title,
      description,
      existingUrls : JSON.stringify(existingfiles),
      filesRemoved : JSON.stringify(filesRemoved),
      newImages
    }
    props.updateMoment(id, updated);
  }
  

  const renderImages = () => {
    let tImagesArray = []
    tImagesArray = existingfiles.map((url : string, index : number) => {
      return {url : url, type : FileType.alreadyExisting, index : index};
    });
    tImagesArray = tImagesArray.concat(newImages.map((file : File, index : number) => {
      return {url : URL.createObjectURL(file), type : FileType.recentlyAdded, index : index};
    }));

    const displayImages = (tImagesArray);

    if(existingfiles.length === 0){
      return (
        <Row className="mb-2">
          <Col>
            <div className={editSelectedMomentStyles.uploadImgBtnGroup}>
              <button className={editSelectedMomentStyles.uploadImgBtn}><FontAwesomeIcon icon={faImages} size='2x' />&nbsp;<div>Add image</div></button>
              <input className={editSelectedMomentStyles.uploadImgInp} type="file" id="edtmntupldimg" name="edtmntupldimg" accept="image/*" onChange={onImagesSelect} multiple/>                  
            </div>
          </Col>
        </Row>
      )
    }
    let requiredRows: number = 0;
    if((displayImages.length + 1) < 5){
      requiredRows = 1;
    }else{
      requiredRows = (displayImages.length + 1) / 5;
    }
    const rows = [];
    let pointer = 0;
    for (let r = 0; r < requiredRows; r++) {
      const cols = [];
      for (let c = 0; c < 5; c++) {
        if(pointer === displayImages.length){
          if(displayImages.length !== 10){
            cols.push( <Col key={pointer}>
              <div className={editSelectedMomentStyles.uploadImgBtnGroup}>
                <button className={editSelectedMomentStyles.uploadImgBtn}><FontAwesomeIcon icon={faImages} size='2x' />&nbsp;<div>Add image</div></button>
                <input className={editSelectedMomentStyles.uploadImgInp} type="file" id="edtmntupldimg" name="edtmntupldimg" accept="image/*" onChange={onImagesSelect} multiple/>                  
              </div>
            </Col>);
          }
        } else if(pointer > displayImages.length) {
          cols.push(<Col key={pointer}></Col>);
        } else {        
          cols.push(
          <Col key={pointer}>
              <EditImg
                index={displayImages[pointer].index}
                data={displayImages[pointer]}
                removeImage={removeImage}
              />
            </Col>
          );
        }
        pointer++;   
      }
      rows.push(
        <Row key={r} className="mb-2">
          {" "}
          {cols}{" "}
        </Row>
      );
    }

    return <div>{rows}</div>;
  };

  return (
    <div className={editSelectedMomentStyles.selectedMoment}>
      <div className={editSelectedMomentStyles.optTit}>Edit Moment</div>
      <form onSubmit={onUpdate}>
        <div className={editSelectedMomentStyles.rw1Ht}>
          <div className={`mt-2 ${editSelectedMomentStyles.ti}`}>Title</div>
          <Form.Control
            className={editSelectedMomentStyles.title}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className={`mt-2 ${editSelectedMomentStyles.ti}`}>
            Description
          </div>
          <Form.Control
            as="textarea"
            className={editSelectedMomentStyles.desc}
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className={editSelectedMomentStyles.imgs}>{renderImages()}</div>
        {imageswarning &&
                    <div className="mb-2">{imageswarning}</div>
                }
        <Button type='submit' className={editSelectedMomentStyles.updtBtn} >Update</Button>
      </form>
    </div>
  );
}

EditSelectedMoment.propTypes = {
  updateMoment : PropTypes.func.isRequired,
  //updated : PropTypes.bool.isRequired
}

// const mapStateToProps = (state : any) => ({
//   updated : state.moments.updated
// });

export default connect(null, {updateMoment}) (EditSelectedMoment);
