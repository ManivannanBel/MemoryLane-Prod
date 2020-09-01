import React, { useState } from 'react'
import './ToggleButton.css';

function ToggleButton(props : any) {
    
    const [isOn, setIsOn] = useState(false);

    let switchClass = ["switch", (isOn) ? "switch_is-on" : "switch_is-off"].join(" ");
    let Toggleclass = ["toggle-button", (isOn) ? "toggle-button_position-right" : "toggle-button_position-left"].join(" ");

    const handleToggle = () => {
        props.setSortByCreationDate(!isOn);
        setIsOn(!isOn);
    }

    return (
        <div className={switchClass} onClick={handleToggle}>
			<div className={Toggleclass}></div>
		</div>
    )
}

export default ToggleButton
