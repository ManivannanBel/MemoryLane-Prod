import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import PropsTypes from "prop-types";
import { getProfileData } from "../../../actions/profileActions";
import {
  getRelationshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  block,
  unblock,
  unfriend,
  cancelRequest,
  rejectRequest
} from "../../../actions/relationshipActions";
import ProfileImage from "./ProfileImage";
import profileStyles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserClock,
  faUserFriends,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import AddFirend from "./relationshipButtons/AddFirend";
import RequestSent from "./relationshipButtons/RequestSent";
import AcceptRequest from "./relationshipButtons/AcceptRequest";
import Friends from "./relationshipButtons/Friends";
import Unblock from "./relationshipButtons/Unblock";

function Profile(props: any) {
  let { username } = useParams();

  //const [username, setUsername] = useState('manivannan1234');
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [createdDate, setCreatedDate] = useState(new Date());
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://avatars3.githubusercontent.com/u/34658746?s=460&u=23bb59d32de4568d04e18b27ac21642d2ec54407&v=4"
  );

  useEffect(() => {
    //console.log("calling pa")
    //console.log(props.auth.username);
    props.getProfileData(username);
    if (props.auth.username !== username) {
      props.getRelationshipStatus(username);
    }
  }, [username]);

  useEffect(() => {
    //setUsername(props.profile.username);
    setEmail(props.profile.email);
    setFirstname(props.profile.firstname);
    setLastname(props.profile.lastname);
    setCreatedDate(props.profile.createdAt);
    setPhone(props.profile.phone);
    setProfileImage(props.profile.profileImage);
    //console.log(props);
  }, [props.profile]);

  const sendFriendRequest = () => {
    props.sendFriendRequest(username);
  };

  const acceptFriendRequest = () => {
    props.acceptFriendRequest(username);
  };

  const unfriend = () => {
    props.unfriend(username);
  };

  const block = () => {
    props.block(username);
  };

  const unblock = () => {
    props.unblock(username);
  };

  const cancelRequest = () => {
    props.cancelRequest(username);
  };

  const rejectRequest = () => {
      props.rejectRequest(username);
  }

  const renderRelationshipButton = () => {
    const status = props.relationshipStatus.status;
    const userAction = props.relationshipStatus.userAction;
    if (
      status === "NotFriends" ||
      (status === "Declined" && userAction === "you")
    ) {
      return (
        <Row>
          {/* {<Button className={profileStyles.frndReqBtn} onClick={sendFriendRequest}>Add firend&nbsp;<FontAwesomeIcon icon={faUserPlus} color={'white'}/></Button>} */}
          <AddFirend sendFriendRequest={sendFriendRequest} />
        </Row>
      );
    } else if (status === "Pending" && userAction === "you") {
      return (
        <Row>
          <RequestSent />
        </Row>
      );
    } else if (status === "Pending" && userAction === "otherPerson") {
      return (
        <Row>
          <AcceptRequest
            acceptFriendRequest={acceptFriendRequest}
            firstname={firstname}
            rejectRequest={rejectRequest}
          />
        </Row>
      );
    } else if (status === "Accepted") {
      return (
        <Row>
          <Friends unfriend={unfriend} block={block} />
        </Row>
      );
    } else if (status === "Blocked" && userAction === "you") {
      return (
        <Row>
          <Unblock unblock={unblock} />
        </Row>
      );
    }
  };

  return (
    <div className={profileStyles.profile}>
      <Row>
        <Col md={4}>
          <Row>
            <ProfileImage profileImage={profileImage} username={username}/>
          </Row>
          {props.auth.username !== username && renderRelationshipButton()}
        </Col>
        <Col md={8} className="mt-2">
          <Row>
            <Col>
              <div className={profileStyles.username}>{username}</div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <div className={profileStyles.namesDiv}>
                <span className={profileStyles.names}>{firstname}</span>
                <span>&nbsp;</span>
                <span className={profileStyles.names}>{lastname}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>{new Date(createdDate).toDateString().toString()}</Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

Profile.propTypes = {
  profile: PropsTypes.object.isRequired,
  auth: PropsTypes.object.isRequired,
  getProfileData: PropsTypes.func.isRequired,
  getRelationshipStatus: PropsTypes.func.isRequired,
  relationshipStatus: PropsTypes.object.isRequired,
  sendFriendRequest: PropsTypes.func.isRequired,
  acceptFriendRequest: PropsTypes.func.isRequired,
  block: PropsTypes.func.isRequired,
  unblock: PropsTypes.func.isRequired,
  unfriend: PropsTypes.func.isRequired,
  cancelRequest: PropsTypes.func.isRequired,
  rejectRequest: PropsTypes.func.isRequired
};

const mapStateToProps = (state: any) => ({
  profile: state.profile,
  auth: state.auth,
  relationshipStatus: state.relationship.relationshipStatus
});

export default connect(mapStateToProps, {
  getProfileData,
  getRelationshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  block,
  unblock,
  unfriend,
  cancelRequest,
  rejectRequest
})(Profile);
