import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Moment from "../moment/Moment";
import { Row, Col, Container } from "react-bootstrap";
import memoryLaneStyles from "./MemoryLane.module.css";
import { fetchUserData, setQueryToLocal } from "../../../actions/authActions";
import { loadMemoryLane } from '../../../actions/memoryLaneActions';
import {
  showLoginPanel,
  showRegisterPanel
} from "../../../actions/headerActions";
import { connect, useStore } from "react-redux";
import PropTypes from "prop-types";
import LoginModel from "../../auth/LoginModel";
import RegisterModel from "../../auth/RegisterModel";

function MemoryLane(props: any) {
  const history = useHistory();

  const [moments, setMoments] = useState([]);

  useEffect(() => {
    if (!props.auth.isAuth) {
      const paramString: string = props.location.search;
      const params = new URLSearchParams(paramString);
      console.log(params.get("do"));
      if (params.get("success") && params.get("token")) {
        props.setQueryToLocal(params.get("token"), history);
      } else if (params.get("do")) {
        if (params.get("do") === "signin") {
          props.showLoginPanel();
        } else if (params.get("do") === "register") {
          props.showRegisterPanel();
        }
      }
    }else{  
      props.loadMemoryLane();
    }
  }, [props.auth.isAuth]);

  useEffect(() => {
    const tArr : Array<any> = Array.from(props.moments.values());
    tArr.sort(sortByCreationDt());
    setMoments(tArr);
  }, [props.moments])

  const sortByCreationDt = () => {
    return (a : any, b : any) => {
        let aDate = new Date(a.createdAt);
        let bDate = new Date(b.createdAt);
        if(aDate.getTime() < bDate.getTime()){
            return 1;
        }
        if(aDate.getTime() > bDate.getTime()){
            return -1;
        }
        return 0;
    }
  }

  const renderMoments = () => {
    return moments.map(moment => 
                        <Row>
                          <Col>
                            {<Moment key={moment.id} moment={moment} />}
                          </Col>
                        </Row>
                      );
  }

  return (
    <React.Fragment>
      <Container>
        <div className={memoryLaneStyles.memoryLane}>
          {renderMoments()}
        </div>
      </Container>
      <LoginModel show={false} />
      <RegisterModel show={false} />
    </React.Fragment>
  );
}

MemoryLane.propTypes = {
  fetchUserData: PropTypes.func.isRequired,
  setQueryToLocal: PropTypes.func.isRequired,
  showLoginPanel: PropTypes.func.isRequired,
  showRegisterPanel: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  loadMemoryLane : PropTypes.func.isRequired,
  moments : PropTypes.array.isRequired
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  moments : state.memoryLane.moments
});

export default connect(mapStateToProps, {
  fetchUserData,
  setQueryToLocal,
  showLoginPanel,
  showRegisterPanel,
  loadMemoryLane
})(MemoryLane);
