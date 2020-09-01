import React, { useState } from 'react'
import CreateMomentStyles from './CreateMoment.module.css';
import { Form } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faImages, faPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import PropsTypes from 'prop-types';
import { ICreateMoment } from '../../../types/requestPayloads/moment';
import { createMoment } from '../../../actions/momentActions';
import SelectedImages from './SelectedImages';
import DatePicker from './datePicker/DatePicker';
import AddGroupModal from './addGroup/AddGroupModal';

function CreateMoment(props : any) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images , setImages] = useState<Array<File>>([]);
    //const [date, setDate] = useState(new Date());
    let date = new Date();
    const [imageswarning, setImagesWarning] = useState('');
    const [showAddMates, setShowAddMates] = useState(false);
    const [group, setGroup] = useState([]);

    const setDate = (d) => {
      date = d;  
    }

    const submitMoment = (event : any) => {
      event.preventDefault();
      if(title.trim() === "" && description.trim() === "" && images.length === 0){
        window.alert('Please enter data');
        return;
      }
      const newMoment : ICreateMoment = {
        title,
        description,
        //description : formatParagraph(description),
        images,
        date,
        group
      }
      console.log(newMoment);
      props.createMoment(newMoment);
    }

    const onImagesSelect = (event : any) => {
      //console.log(event.target);
      let imageFiles : File[] = Object.values(event.target.files);
      //console.log(JSON.stringify(imageFiles));
      imageFiles = images.concat(imageFiles);

      if(imageFiles.length > 10){
        imageFiles = imageFiles.slice(0, 10);
        setImagesWarning('maximum 10 photos are allowed per moment');
      }
      //console.log(imageFiles);
      setImages(imageFiles);
    }

    const removeImage = (index : number) => {
      //console.log(index);
      //console.log(images)
      let tImage = images.slice();
      tImage.splice(index, 1);
      //console.log(tImage)
      setImages(tImage);
    }

    return (
          <React.Fragment>
          <Form >
            <div className={CreateMomentStyles.createMoment1}>
          <div className={CreateMomentStyles.createText}>Create your moment</div>  
                <Form.Control className={`mb-2 ${CreateMomentStyles.cmInpt}`} type="text" placeholder="Your moment title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Form.Control className={`mb-2 ${CreateMomentStyles.cmInpttextarea}`} as="textarea" rows={4} placeholder="Moment description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                {imageswarning &&
                    <div className="mb-2">{imageswarning}</div>
                }
                {images.length !== 0 &&
                  <SelectedImages images={images} removeImage={removeImage}/>
                }
                <div className={CreateMomentStyles.momentBtns}>
                  <div className={CreateMomentStyles.uploadImgBtnGroup}>
                    <button className={CreateMomentStyles.uploadImgBtn}><FontAwesomeIcon icon={faImages} size='2x' />&nbsp;<span>Add image</span></button>
                    <input className={CreateMomentStyles.uploadImgInp} type="file" id="img" name="file" accept="image/*" onChange={onImagesSelect} multiple/>                  
                  </div>
                  <div><div className={CreateMomentStyles.addGrpBtn} onClick={() => setShowAddMates(true)}>Add group</div></div>
                  <div className={CreateMomentStyles.calCov}><DatePicker setDate={setDate}/></div>
                </div>
                </div>
                <div className={CreateMomentStyles.createMmtBtnCov}>
                    <button type="submit" onClick = {submitMoment} className={`${CreateMomentStyles.createMmtBtn} btn`}><FontAwesomeIcon icon={faPlus} size='2x' />&nbsp;<span>Create moment</span></button>             
                </div>
          </Form>
          <AddGroupModal show={showAddMates} setShowAddMates={setShowAddMates} group={group} setGroup={setGroup}/>
          </React.Fragment>  
    )
}

CreateMoment.propTypes = {
  createMoment : PropsTypes.func.isRequired
}

export default connect(null, {createMoment}) (CreateMoment);
