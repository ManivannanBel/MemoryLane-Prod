import React, {useState, useEffect} from 'react';
import { FormControl, Form } from 'react-bootstrap';
import searchBarStyles from './SearchBar.module.css';
import {
    searchTheQuery,
    clearSearchResults
  } from "../../actions/headerActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SearchResults from './SearchResults';

function SearchBar(props : any) {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestion, setShowSuggestion] = useState(false);
    let timeout : any; 

    useEffect(() => {
        setSearchResults(props.searchResults);
        console.log(props.searchResults);
      },[props.searchResults])

    useEffect(() => {
      if(searchQuery.trim().length === 0){
        console.log(`clear`);
        props.clearSearchResults();
      }       
    }, [searchQuery])

    const onSearchQueryChange = (event: any) => {
        setSearchQuery(event.target.value);
        if (event.target.value.trim().length > 0) {
          //console.log('search q='+event.target.value);
          props.searchTheQuery(event.target.value);
        } else if(event.target.value.trim().length === 0 || event.target.value === "" || searchQuery === "") {
          //console.log('clear suggestion');
          setSearchResults([]);
          props.clearSearchResults();
        }
      };

    const onInputFieldFocus = () => {
      //setSearchResults(props.searchResults);
      unHideSuggestion();
    }
    
    const hideSuggestion = (event : any) => {
      timeout = setTimeout(() => {
        if(showSuggestion){
          setShowSuggestion(false);
        }
      });
    }

    const onFocusHandler = () => {
      clearTimeout(timeout);
    }

    const unHideSuggestion = () => {
      if(!showSuggestion){
        setShowSuggestion(true);
      }
    }

    return (
        <Form inline onBlur={hideSuggestion} onFocus={onFocusHandler}>
              <FormControl
                type="text"
                placeholder="Search people"
                className={searchBarStyles.searchBar}
                value={searchQuery}
                onChange={onSearchQueryChange}
                onFocus={onInputFieldFocus}
              />
              <SearchResults searchResults={searchResults} showSuggestion={showSuggestion} hideSuggestion={hideSuggestion}/>
        </Form>
    )
}

SearchBar.propTypes = {
    searchTheQuery: PropTypes.func.isRequired,
    clearSearchResults: PropTypes.func.isRequired
}

const mapStateToProps = (state: any) => ({
    searchResults: state.header.searchResults
  });

export default connect(mapStateToProps, {
    searchTheQuery,
    clearSearchResults
  })(SearchBar);
