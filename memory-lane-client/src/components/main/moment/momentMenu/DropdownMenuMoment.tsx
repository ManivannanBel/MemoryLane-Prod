import React, { useState, useEffect } from "react";
import MeatballIco from "./MeatballIco";
import dropdownMenuMomentStyles from "./DropdownMenuMoment.module.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteMoment } from "../../../../actions/momentActions";
import EditMomentModal from "../editSelectedMoment/EditMomentModal";

function DropdownMenuMoment(props: any) {
  const [show, setShow] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  let timeout : any; 

  useEffect(() => {
      if(props.closeMenu){
          props.setCloseMenu(false);
          setShow(false);
      }
  }, [props.closeMenu]);

  const remove = () => {
    props.deleteMoment(props.moment.id);
  };

  const onFocusHandler = () => {
    clearTimeout(timeout);
  }

  const hideMenu = (event : any) => {
    timeout = setTimeout(() => {
      if(show){
        setShow(false);
      }
    });
  }

  const renderMenuOptions = () => {
    if (props.owned) {
      return (
        <ul className={`no-select ${dropdownMenuMomentStyles.lst}`}>
          <div
            className={dropdownMenuMomentStyles.lstItm}
            onClick={e => {
              setShowEditPanel(true);
              setShow(false);
            }}
          >
            Edit
          </div>
          <div className={dropdownMenuMomentStyles.lstItm}>Add people</div>
          <div className={dropdownMenuMomentStyles.lstItm} onClick={remove}>
            Delete
          </div>
        </ul>
      );
    } else {
      return (
        <ul className={`no-select ${dropdownMenuMomentStyles.lst}`}>
          <div className={dropdownMenuMomentStyles.lstItm}>report</div>
        </ul>
      );
    }
  };

  return (
    <React.Fragment>
      <div onClick={() => {setShow(!show)}} onBlur={hideMenu} >
        <div>
          <MeatballIco />
        </div>
        {show && (
          <div className={dropdownMenuMomentStyles.drpdwnLst}>
            <div className={dropdownMenuMomentStyles.arwWrpr}>
              <div className={dropdownMenuMomentStyles.arwUp}></div>
            </div>
            {renderMenuOptions()}
          </div>
        )}
      </div>
      <EditMomentModal
        show={showEditPanel}
        setShowEditPanel={setShowEditPanel}
        moment={props.moment}
      />
    </React.Fragment>
  );
}

DropdownMenuMoment.propTypes = {
  deleteMoment: PropTypes.func.isRequired
};

export default connect(null, { deleteMoment })(DropdownMenuMoment);
