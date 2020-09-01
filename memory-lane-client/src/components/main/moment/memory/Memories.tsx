import React, {useState, useEffect} from "react";
import memoriesStyles from "./Memories.module.css";
import AddMemory from "./AddMemory";
import Memory from "./Memory";
import { connect } from 'react-redux';
import { getMemories, createMemory } from '../../../../actions/memoryActions';
import PropTypes from 'prop-types'; 
import { ICreateMemory } from '../../../../types/requestPayloads/memory';

function Memories(props : any) {

  const [memories, setMemories] = useState([]);

  useEffect(() => {
    props.getMemories(props.momentId);
  }, []); 

  useEffect(() => {
        console.log(props.memoriesMap)
        const tMem = (props.memoriesMap.get(props.momentId)) ? Array.from(props.memoriesMap.get(props.momentId).values()) : [];
        setMemories(tMem);
  }, [props.memoriesMap]);

  const createMemory = (data : string) => {
    console.log("create memory")
    const newMemory : ICreateMemory = {
      memory : data
    }
    props.createMemory(newMemory, props.momentId);
  }

  const renderMemories = () => {
    return (
      memories.map(memory => 
        <li key={memory.id} className={memoriesStyles.li}>
          <Memory memory={memory} />
        </li>
      )
    )
  }

  return (
    <div className={memoriesStyles.memWrapr}>
      <div className={memoriesStyles.memoriesTitle}>Memories</div>
      <div className={memoriesStyles.memLiCov}>
      {renderMemories()}
      </div>
      <div className={memoriesStyles.adMem}>
        <AddMemory createMemory={createMemory} />
      </div>
    </div>
  );
}

Memories.propTypes = {
  getMemories : PropTypes.func.isRequired,
  createMemory : PropTypes.func.isRequired,
  memoriesMap : PropTypes.any.isRequired
}

const mapStateToProps = (state : any) => ({
  memoriesMap : state.memories.memoriesMap
})

export default connect(mapStateToProps, {getMemories, createMemory}) (Memories);
