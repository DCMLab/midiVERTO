import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className='navbar'>
      <h1>MIDFT</h1>
      <div className='container'>
        <Link to='/'>Home</Link>
        <Link to='/visualization'>App</Link>
      </div>
    </nav>
  );
}
