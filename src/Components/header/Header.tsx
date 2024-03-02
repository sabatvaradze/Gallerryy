import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: FC = () => {
  return (
    <div className='header-div'>
      <nav className='navigation'>
        <ul className='ul-list'>
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
