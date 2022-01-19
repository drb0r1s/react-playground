import React, { useState, useEffect, useMemo } from "react";
import { headerData, headerDataLogo } from "./data";
import reactLogo from "./images/react-logo.png";
import useResponsiveObj from "./useResponsiveObj";

const Header = (props) => {
    const {
        currentSection, isMenu, menuAction
    } = props;

    const [logoColor, setLogoColor] = useState("");
    const [isResponsive, setIsResponsive] = useState(false);

    useEffect(() => {
        const menuBreakpoint = window.matchMedia("(max-width: 1024px)");

        if(menuBreakpoint.matches) setIsResponsive(true);
        else setIsResponsive(false);
        
        window.addEventListener("resize", () => {
            if(menuBreakpoint.matches) setIsResponsive(true);
            else setIsResponsive(false);
        });
    }, []);

    useEffect(() => {
        const colorFinder = headerDataLogo.find((object) => 
            object.name === currentSection
        );

        if(colorFinder === undefined) setLogoColor("");
        else setLogoColor(colorFinder.rotation);
    }, [currentSection]);

    const hueRotation = {
        filter: `hue-rotate(${logoColor}deg)`
    };

    const isPlayground = useMemo(() => {
        return {
            xxs: true,
            xs: true
        }
    }, []);

    const { responsive } = useResponsiveObj(isPlayground);
    
    return(
        <header>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-4 logo-holder">
                        <a href="#home">
                            <img
                                src={reactLogo}
                                alt="REACT"
                                style={logoColor ? hueRotation : null}
                            />
                            
                            {!responsive && <p>playground</p>}
                        </a>
                    </div>

                    {isResponsive ? 
                        <div className="responsive-holder">
                            <button
                                className="responsive-button"
                                id={isMenu ? "active-responsive-button" : ""}
                                onClick={menuAction}
                            ></button>
                        </div>
                    : <div className="col-8 menu-holder">
                        <nav>
                            {headerData.map((section) => {
                                return <a
                                    key={section.id}
                                    href={`#${section.name}`}
                                    id={currentSection === section.name ? "current-section" : ""}
                                    style={currentSection === section.name ? {
                                        textShadow: `3px 3px 2px ${section.color}`
                                    } : null}
                                >{section.name}</a>
                            })}
                        </nav>
                    </div>}
                </div>
            </div>
        </header>
    );
}

export default Header;