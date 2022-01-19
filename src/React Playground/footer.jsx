import React from "react";
import reactLogo from "./images/react-logo.png";
import borisLogo from "./images/boris-logo.png";

const Footer = () => {
    return(
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 logo-holder">
                        <img src={reactLogo} alt="REACT" />
                        <p>playground</p>
                    </div>

                    <div className="col-md-6 signature">
                        <a href="https://boris.ml">
                            <img src={borisLogo} alt="B O R I S" />
                        </a>
                        
                        <div className="text-holder">
                            <strong>&copy;drb0r1s - 2022</strong>
                            <strong>drb0r1sdev@gmail.com</strong>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;