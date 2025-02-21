import React from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

const Spinner: React.FC<Props> = ({ size = 'md', dark = false }) => (
  <div className={styles.wrapper}>
    <div
      data-testid='spinner'
      className={clsx(styles.spinner, dark && styles.dark, styles[size])}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

type Props = {
  size?: 'md' | 'lg' | 'sm';
  dark?: boolean;
};

export default Spinner;
