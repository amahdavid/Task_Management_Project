import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon you want

function Icon({ icon }) {
  return (
    <div>
      <FontAwesomeIcon icon={faCoffee} /> {/* Replace with the icon prop */}
    </div>
  );
}

export default Icon;
