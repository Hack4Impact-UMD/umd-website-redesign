import React from "react";
import styles from '../../styles/buttons/Buttons.module.css';


function BlueButton(props: any) {
    return (
        <a href={props.link}>
            <button aria-label={props.text} className={styles.bluebutton}>
                {props.text}
            </button>
        </a>
    );
}

export default BlueButton;