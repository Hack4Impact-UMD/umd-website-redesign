import React from 'react';
import styles from '../../styles/home/Supporters.module.css';
import StandardButton from '../buttons/StandardButton';

const Supporters = () => {
    return (
        <div id={styles.supportersContainer}>
            <h2>Our Supporters</h2>
            <h4 className={styles.divider}><span>GOLD</span></h4>
            <h4 className={styles.divider}><span>SILVER</span></h4>
            <h4 className={styles.divider}><span>BRONZE</span></h4>
            <a href={'mailto:umd@hack4impact.org'}>{'Interested in partnering? Contact us!'}</a>
        </div>
    );
};

export default Supporters;