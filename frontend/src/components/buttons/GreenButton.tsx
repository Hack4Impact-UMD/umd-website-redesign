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

// White text, Karla, 18px.

export default GreenButton;
