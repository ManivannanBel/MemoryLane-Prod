import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserImg from "./UserImg";
import memoriesStyles from "./Memories.module.css";


function Memory(props : any) {
    
    const memory = props.memory;

    return (
        <div>
            <div className={memoriesStyles.memTxt}>
                <Link className={'no-a'} to={memory.owner.username}>
                <div className={memoriesStyles.memUsrNm}>
                    <UserImg src={memory.owner.profilePic}/> {`${memory.owner.firstname} ${memory.owner.lastname}`}
                </div>
                </Link>
                <div  className={memoriesStyles.Mrywrpr}>
                    {memory.memory}
              </div>
            </div>
          </div>
    )
}

export default (Memory)
