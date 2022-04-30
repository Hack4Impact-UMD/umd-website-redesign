import React from 'react';
import Button from './CustomButtonComponent';

const GreenButton: React.FC = () => {
  return (
    <Button
      border="none"
      color="#80d2c8"
      height="55px"
      radius="100px"
      width="180px"
      onClick={() => null}
      text="Click me to go to google"
    />
  );
};

// white text ffffff, font is Rubik, Size is 18px

export default GreenButton;
