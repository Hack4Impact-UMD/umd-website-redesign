import React from "react";
import Button from "./CustomButtonComponent";

const BlueButton: React.FC = () => {
    return (
        <Button 
        border="none"
        color="#0069ca"
        height = "55px"
        radius = "100px"
        width = "180px"
        onClick = {() => null}
        text = "Click me to go to google"
        />
    );
}

export default BlueButton;