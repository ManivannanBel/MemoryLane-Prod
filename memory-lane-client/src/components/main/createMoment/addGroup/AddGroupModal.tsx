import React, { useState, useEffect } from "react";
import addGroupStyles from "./AddGroupModal.module.css";
import { Modal, Row, Col } from "react-bootstrap";
import { searchUserQuery } from '../../../../actions/momentActions';
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';

const AddGroupModal = (props: any) => {
  const [display, setDisplay] = useState(true);
  const [groupMates, setGroupMates] = useState<Map<string,string>>(new Map());
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(true);
  let _timeout : any;
  let tagInput : any;

    useEffect(() => {
        let temp = props.userSearchResult;
        temp = temp.filter((res : any) => {return !groupMates.has(res.username)});
        setSearchResults(temp);
    },[props.userSearchResult])

    useEffect(() => {
    if(searchQuery.trim().length === 0){
    }       
    }, [searchQuery])

  const removeTag = (i : any) => {
    const tempMap = new Map(groupMates);
    tempMap.delete(i);
    setGroupMates(tempMap);
  }

  const onSearchQueryChange = (event: any) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim().length > 0) {
      //console.log('search q='+event.target.value);
      props.searchUserQuery(event.target.value);
    } else if(event.target.value.trim().length === 0 || event.target.value === "" || searchQuery === "") {
      //console.log('clear suggestion');
      setSearchResults([]);
      //props.clearSearchResults();
    }
  };

  const hideSuggestion = (event : any) => {
     _timeout = setTimeout(() => {
       if(showSuggestion)   
         setShowSuggestion(false);
      }, 0);
      console.log(_timeout);
  }

  const onFocusHandler = (event : any) => {
    console.log(_timeout);
      clearTimeout(_timeout);
  }

  const selectMate = (username : string, firstname : string, lastname : string) => {
    setShowSuggestion(false);
    const tempMap = new Map(groupMates);
    tempMap.set(username, `${firstname} ${(lastname) ? lastname : ''}`);
    setGroupMates(tempMap);

    let temp = searchResults;
    temp = temp.filter((res : any) => {return username !== res.username});
    setSearchResults(temp);
  }

  const renderGroupMates = () => {
    const listRes : any = new Array<any>();

      groupMates.forEach((fullname : string, username : string) => {
        listRes.push(<li key={username}>
                        {fullname}
                        <button
                          type="button"
                          onClick={() => {
                            removeTag(username);
                          }}
                        >
                          +
                        </button>
                      </li>)
      })  
      return listRes;
  }

  const addGroup = (event : any) => {
    console.log(JSON.stringify(Array.from(groupMates.keys())));
    props.setGroup(JSON.stringify(Array.from(groupMates.keys())));
    props.setShowAddMates(false);
  }

  return (
    <Modal
      dialogClassName={`${addGroupStyles.modalDialog}`}
      {...props}
      size="lg"
      centered
    >
      <div className={addGroupStyles.model}>
        <div className={addGroupStyles.ttle}>
          <div>Add groupmates</div>
        </div>
        <div>
          <div className={addGroupStyles.input_tag}>
            <ul className={addGroupStyles.input_tag__tags}>
              {renderGroupMates()}
            </ul>
            <form className={addGroupStyles.frm}  onFocus={onFocusHandler}>
                <input
                    className={addGroupStyles.inp}
                    type="text"
                    value={searchQuery}
                    onChange={onSearchQueryChange}
                    onFocus={() => setShowSuggestion(true)}
                    placeholder={'Search groupmates'}
                />
                <div>
                    {
                    showSuggestion && searchResults.length > 0 && 
                    <ul className={addGroupStyles.ulo}>
                      {
                        searchResults.map((user : any) => 
                            <li key={user.username} className={addGroupStyles.lst} onClick={() => {selectMate(user.username, user.firstname, user.lastname)}}>
                                <img/>
                                <div>
                                    <span>
                                        {`${user.firstname}`}
                                    </span>
                                    {user.lastname && <span>
                                        {` ${user.lastname}`}
                                    </span>}
                                </div>
                            </li>                          
                        ) 
                      }     
                    </ul>
                    }
                </div>
            </form>
            
          </div>
        </div>
        <div className={addGroupStyles.btnWrpr}>
            <div className={addGroupStyles.btn} onClick={addGroup}>Add</div>
            <div className={addGroupStyles.btn} onClick={() => props.setShowAddMates(false)}>Cancel</div>
        </div>
      </div>
    </Modal>
  );
};

AddGroupModal.propTypes = {
    searchUserQuery : PropTypes.func.isRequired,
    userSearchResult : PropTypes.array.isRequired
}

const mapStateToProps = (state : any) => ({
    userSearchResult : state.moments.userSearchResult
});

export default connect(mapStateToProps, {searchUserQuery}) (AddGroupModal);
