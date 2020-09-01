import React, {useEffect, useState} from 'react'
import {Row, Col} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PersonalMemoryLaneStyles from './PersonalMemoryLane.module.css';
import Moment from '../moment/Moment';
import CreateMoment from '../createMoment/CreateMoment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserMoments, clearUserMoments } from '../../../actions/momentActions';
import ToggleButton from './toggleBtn/ToggleButton';

function PersonalMemoryLane(props : any) {

    const {username} = useParams();
    const [moments, setMoments] = useState([]);
    const [sortByCreationDate, setSortByCreationDate] = useState(false);
    //const [user, setUser] = useState({});

    useEffect(() => {

    });

    useEffect(() => {
        //console.log("get um")
        props.getUserMoments(username);
        return () => {
            props.clearUserMoments();
        }
    }, [username]);

    useEffect(() => {
        const tArr : Array<any> = Array.from(props.userMoments.values());
        const compare = (sortByCreationDate) ? sortByCreationDt() : sortByMomentDt();
        tArr.sort(compare);
        setMoments(tArr);
    }, [props.userMoments, sortByCreationDate]);

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

    const sortByMomentDt = () => {
        return (a : any, b : any) => {
            let aDate = new Date(a.date);
            let bDate = new Date(b.date);
            if(aDate.getTime() < bDate.getTime()){
                return 1;
            }
            if(aDate.getTime() > bDate.getTime()){
                return -1;
            }
            return 0;
        }
    }

    const toggleSortType = () => {
        setSortByCreationDate(!sortByCreationDate);
    }

    const renderMomentTitle = () => {
        return (<div className={PersonalMemoryLaneStyles.ttl}>{(props.auth.username == username) ? <React.Fragment>Your</React.Fragment> : <React.Fragment>{props.firstname} {props.lastname}'s</React.Fragment>} personal memory lane</div>);
    }

    const renderMomentSortType = () => {
       
            return (
                <div className={PersonalMemoryLaneStyles.mmtOrderTgl}>
                        Show moments in&nbsp;
                        <div className={`${PersonalMemoryLaneStyles.tglOpt} ${(sortByCreationDate)?(PersonalMemoryLaneStyles.tglSlctd):''}`} onClick={toggleSortType}>
                            created date
                        </div>
                        &nbsp;or&nbsp;
                        <div className={`${PersonalMemoryLaneStyles.tglOpt} ${(!sortByCreationDate)?(PersonalMemoryLaneStyles.tglSlctd):''}`} onClick={toggleSortType}>
                            moment date
                        </div>
                        &nbsp;order
                    </div>
            )
        
    }

    const renderMoments = () => {
        return moments.map((moment : any) => 
            <Row key={moment.id}>
                <Col key={moment.id}>
                    <Moment key={moment.id} moment={moment} />
                </Col>  
            </Row>
        );
    }

    return (
        <div className={PersonalMemoryLaneStyles.memoryLaneP}>
            <div className={PersonalMemoryLaneStyles.lane}>
                <CreateMoment/>
                {
                    (moments.length !== 0) && 
                        <div className={PersonalMemoryLaneStyles.ttlCov}>
                            {renderMomentTitle()}
                            {renderMomentSortType()}
                        </div>
                }
                <div className={PersonalMemoryLaneStyles.prsnlMryLnContainer}>
                    {renderMoments()}
                </div>
            </div> 
        </div>
    )
}

PersonalMemoryLane.propTypes = {
    userMoments : PropTypes.any.isRequired,
    getUserMoments : PropTypes.func.isRequired,
    clearUserMoments : PropTypes.func.isRequired,
    auth : PropTypes.object.isRequired,
    firstname : PropTypes.string.isRequired,
    lastname : PropTypes.string.isRequired
}

const mapStateToProps = (state : any) => ({
    userMoments : state.moments.userMoments,
    auth : state.auth,
    firstname : state.profile.firstname,
    lastname : state.profile.lastname
});

export default connect(mapStateToProps, {getUserMoments, clearUserMoments}) (PersonalMemoryLane)
