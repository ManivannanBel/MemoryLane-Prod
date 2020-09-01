import React from 'react'
import meatballStyles from './MeatballIco.module.css';

function MeatballIco() {
    return (
        <div className={meatballStyles.menu__wrapper}>
            <div className={meatballStyles.menu_item_meatball}>
                <div className={meatballStyles.circle}></div>
                <div className={meatballStyles.circle}></div>
                <div className={meatballStyles.circle}></div>
            </div>   
        </div>
    )
}

export default MeatballIco
