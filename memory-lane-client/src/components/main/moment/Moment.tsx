import React, { useState, useEffect } from "react";
import { Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import momentjs from "moment";
import MomentStyles from "./Moment.module.css";
import MomentImg from "./MomentImg";
import SelectedModal from "./selectedMoment/SelectedModal";
import MeatballIco from "./momentMenu/MeatballIco";
import DropdownMenuMoment from "./momentMenu/DropdownMenuMoment";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectMenuInTimeLine } from '../../../actions/uiActions'; 


function Moment(props: any) {
  const moment: any = props.moment;
  //console.log(moment);
  const [selected, setSelected] = useState(false);
  const [date, setDate] = useState<string>();
  const fullDate = momentjs(moment.date).format("MMMM Do YYYY, h:mm a");
  const [owned, setOwned] = useState(false);
  const [closeMenu, setCloseMenu] = useState(false);
  const [moreDesc, setMoreDesc] = useState(false);
  const [createDate, setCreatedDate] = useState<string>();

  useEffect(() => {
    //console.log(moment.date)
    let _date = new Date(moment.date);
    //console.log(_date);
    setDate(momentjs(_date).format("MMMM Do YYYY"));
    
    let _createdDate = new Date(moment.createdAt);
    setCreatedDate(momentjs(_createdDate).format("MMMM Do YYYY"));
  }, []);
  //console.log(moment);

  useEffect(() => {
    setOwned((props.authUName === props.moment.owner.username));
  }, [props.authUName]);

  useEffect(() => {
    if(props.previousMenu === moment.id){
      setCloseMenu(true);
    }
  },[props.previousMenu]);

  const openMoment = () => {
    setSelected(true);
  };

  const closeMoment = () => {
    setSelected(false);
  };

  const renderDescription = () => {
    const _desc : string = moment.description;
    // console.log(_desc);
    // console.log(_desc.match(/\n/));
    // console.log(getIndexOfNthOccurrence(_desc, '\n', 3));
    if( ((_desc.match(/\n/)) ? _desc.match(/\n/g).length <= 3 : true) || moreDesc){
      return <div>
              <div>{_desc}</div>
              {moreDesc &&
                <div className={MomentStyles.showMoreBtn} onClick={() => setMoreDesc(false)}>show less</div>}
             </div>;  
    }else{
      const descSplit : Array<string> = _desc.split('\n');
      const shrtDesc : string = `${descSplit[0]}\n${descSplit[1]}\n${descSplit[2]}`;
      return <div>{`${shrtDesc}.....`}<span className={MomentStyles.showMoreBtn} onClick={() => setMoreDesc(true)}> show more</span></div>;
    }
  }

  // const getIndexOfNthOccurrence = (string : string, subString : string, nthOccurrence : number) : number => {
  //   return string.split(subString, nthOccurrence).join(subString).length;
  // }

  const menuBtn = () => {
    //setCloseMenu(!closeMenu);
    if(props.currentMenu !== moment.id)
      props.selectMenuInTimeLine(moment.id);
  }

  const dateTooltip = () => {
    return (
      <div className={MomentStyles.ttp}>
        <div className={MomentStyles.lftArr} />
        <div className={MomentStyles.dtTTip}>{fullDate}</div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={MomentStyles.moment} >
        <Row className={"pt-2"}>
          <Col sm={7}>
            <Link to={moment.owner.username} className="no-a">
              <div className={MomentStyles.wrpr}>
                <img
                  className={MomentStyles.profPic}
                  src={moment.owner.profilePic}
                />
                <div
                  className={MomentStyles.uname}
                >{`${moment.owner.firstname} ${moment.owner.lastname}`}</div>
              </div>
            </Link>
          </Col>
          <Col sm={2}>
            
          </Col>
          <Col sm={3}>
            <Row>
            {/* {<div className={MomentStyles.mtbl}>
              <MeatballIco/>
            </div>} */}
            <OverlayTrigger
              delay={100}
              placement={"right"}
              overlay={dateTooltip()}
            >
              <div className={MomentStyles.date}>{createDate}</div>
            </OverlayTrigger>
            </Row>
            <Row>
            <div className={MomentStyles.mtbl} onClick={menuBtn} >
              <DropdownMenuMoment moment={moment} owned={owned} closeMenu={closeMenu} setCloseMenu={setCloseMenu}/>
            </div>
            </Row>
          </Col>
        </Row>
        <div className={MomentStyles.title}>{moment.title}</div>
        {moment.files.length > 0 && (
          <MomentImg img={moment.files[0]} openMoment={openMoment} />
        )}
        <div className={MomentStyles.desc} >
          {renderDescription()}
        </div>
      </div>
      <SelectedModal
        show={selected}
        closeMoment={closeMoment}
        moment={moment}
      />
    </React.Fragment>
  );
}

Moment.propTypes = {
  authUName : PropTypes.string.isRequired,
  selectMenuInTimeLine : PropTypes.func.isRequired,
  previousMenu : PropTypes.string.isRequired,
  currentMenu : PropTypes.string.isRequired
}

const mapStateToProps = (state : any) => ({
  authUName : state.auth.username,
  previousMenu : state.timelineUI.previouslySelectedDropdown,
  currentMenu : state.timelineUI.currentlySelectedDropdown
})

export default connect(mapStateToProps, {selectMenuInTimeLine}) (Moment);
