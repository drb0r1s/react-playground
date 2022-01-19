import React, { useState, useEffect } from "react";
import Particles from "./particles/particles";
import reactLogo from "./images/react-logo.png";
import borisLogo from "./images/boris-logo.png";

const Home = (props) => {
    const [bg, setBg] = useState("0, 153, 255");
    const [isDark, setIsDark] = useState(false);
    
    useEffect(() => {
        setInterval(() => {
            const r  = Math.floor(Math.random() * 255);
            const g  = Math.floor(Math.random() * 255);
            const b  = Math.floor(Math.random() * 255);

            setBg(`${r}, ${g}, ${b}`);
        }, 5000);
    }, []);

    useEffect(() => {
        const rgb = bg.split(", ");

        setIsDark(false);
        
        rgb.forEach((color) => {
            if(parseInt(color) > 200) setIsDark(true);
        });
    }, [bg]);

    const blackImg = { filter: "brightness(0)" };
    const whiteImg = { filter: "brightness(0) invert(1)" };

    const blackText = { color: "black" };
    const whiteText = { color: "white" };
    
    return(
        <div
            className="home"
            id="home"
            ref={props.setRef}
            style={{ background: `rgb(${bg})` }}
        >
            <Particles />
            
            <div className="logo-holder">
                <img
                    src={reactLogo}
                    alt="REACT"
                    style={isDark ? blackImg : whiteImg}
                />
                <h1
                    style={isDark ? blackText : whiteText}
                >playground</h1>
            </div>
            
            <div className="signature">
                <p
                    style={isDark ? blackText : whiteText}
                >by</p>
                
                <img
                    src={borisLogo}
                    alt="B O R I S"
                    style={isDark ? blackImg : whiteImg}
                />
            </div>
        </div>
    );
}

export default Home;