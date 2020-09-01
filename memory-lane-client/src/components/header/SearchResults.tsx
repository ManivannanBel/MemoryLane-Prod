import React, { useEffect } from 'react';
import searchResultsStyles from './SearchResults.module.css';
import { Link } from 'react-router-dom';

function SearchResults(props : any) {

    const {searchResults, showSuggestion, hideSuggestion} = props;

    useEffect(() =>{
      
    },[]);

    const onResultClick = () => {
      hideSuggestion();
    }

    const renderSuggestions = () => {
          return (
            <React.Fragment>
              {
                searchResults.map((result: any) => 
                  <li key={result.username} className={searchResultsStyles.li} onClick={onResultClick}>
                    <Link  className={searchResultsStyles.resWrpr} to={result.username}>
                      <img src={result.profileImage} />
                      <div><span>{`${result.firstname}`}</span>{result.lastname && <span>{` ${result.lastname}`}</span>} </div>
                      </Link>
                  </li>
                )
              }
            </React.Fragment>
          );
      };

    return (
      <div className={searchResultsStyles.wrpr}>
      {showSuggestion && searchResults.length > 0 && <React.Fragment>
        <div className={searchResultsStyles.upArr}></div>
        <ul className={searchResultsStyles.ulo}>{renderSuggestions()}</ul>
        </React.Fragment>}
      </div>
    )
}

export default SearchResults
