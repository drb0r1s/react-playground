import React, { useState, useEffect, useRef, createRef } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/main.css";

import { dataSections, headerData } from "./data";
import reactLogo from "./images/react-logo.png";

import Header from "./header";
import Footer from "./footer";

const Main = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [refs, setRefs] = useState([]);
    const [currentSection, setCurrentSection] = useState("");
    const [isMenu, setIsMenu] = useState(false);

    const loadingReact = useRef(null);
    const responsiveMenu = useRef(null);

    useEffect(() => {
        if(isLoading) {
            let i = 0;

            changeColor();

            function changeColor() {
                if(loadingReact.current === null) return;
                
                if(i < 1000) {
                    loadingReact.current.style.filter = `hue-rotate(${i}deg)`;
                    i += 100;
                }

                if(i === 1000) i = 0;

                setTimeout(changeColor, 300);
            }
        }
        
        setTimeout(() => {
            setIsLoading(false);
        
            const refArray = [];

            for(let i = 0; i < dataSections.length; i++) {
                refArray.push(createRef());
            }

            setRefs(refArray);
        }, 1500);
    }, [isLoading]);

    useEffect(() => {
        if(refs.length > 0) {
            const options = {
                threshold: 0.5,
                rootMargin: "20px 0px 0px 0px"
            };

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if(entry.isIntersecting) {
                            setCurrentSection(entry.target.id);
                        }
                    });
                },
                options
            );

            for(let i = 0; i < refs.length; i++) {
                observer.observe(refs[i].current);
            }
        }
    }, [refs]);

    function menuAction() {
        if(isMenu) {
            responsiveMenu.current.id = "";

            setTimeout(() => setIsMenu(!isMenu), 300);
        }

        else {
            setIsMenu(!isMenu);

            setTimeout(() => {
                responsiveMenu.current.id = "active-responsive-menu";
            }, 100);
        }
    }

    if(isLoading) {
        return(
            <div className="loading">
                <img src={reactLogo} alt="REACT" ref={loadingReact}/>
                <p>playground</p>
            </div>
        );
    }
    
    return(
        <HelmetProvider>
            <Helmet>
                <title>React Playground</title>

                <meta name="author" content="drb0r1s" />
                <meta name="description" content="React Playground is a website made in React that contains 6 different games." />
                <meta name="keywords" content="React Playground, React, React Functional Components, JavaScript, Games, Number, Dice, Typing, Drawing, Dino, Snake, drb0r1s"/>
            </Helmet>
            
            <Header
                currentSection={currentSection}
                isMenu={isMenu}
                menuAction={menuAction}
            />

            {isMenu && <ResponsiveMenu
                responsiveMenu={responsiveMenu}
                currentSection={currentSection}
            />}

            {dataSections.map((Section, index) => {
                return <Section key={index} setRef={refs[index]}/>
            })}

            <Footer />
        </HelmetProvider>
    );
}

const ResponsiveMenu = (props) => {
    const {
        responsiveMenu, currentSection
    } = props;
    
    return(
        <div
            className="responsive-menu"
            ref={responsiveMenu}
        >
            <a href="#home">
                <img
                    src={reactLogo}
                    alt="REACT"
                />
                            
                <p>playground</p>
            </a>
            
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
        </div>
    );
}

export default Main;