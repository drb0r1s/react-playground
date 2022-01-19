import React from "react";
import { particlesConfig } from "./particles-config";
import ParticlesBackground from "react-tsparticles";

const Particles = () => {
    return(
        <ParticlesBackground
            options={particlesConfig}
            canvasClassName="particle-canvas"
        />
    );
}

export default Particles;