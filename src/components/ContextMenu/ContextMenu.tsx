import React from 'react';
import styles from '@/components/ContextMenu/ContentMenu.module.css';

interface MenuAction {
  label: string;
  onClick: () => void;
  className?: string;
}

interface ContextMenuProps {
  menuActions: MenuAction[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ menuActions}) => {
  return (
    <div
      className={styles.menu}
      role="menu"
      // style={{
      //   top: `${-70}px`,
      //   left:'0px',
      //    position: 'absolute',
      // }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuActions.map((action, index) => (
        <button
          key={index}
          className={`${styles.menuItem} ${action.className || ''}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
