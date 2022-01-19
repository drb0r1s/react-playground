import Home from "./home";
import Number from "./number";
import Dice from "./dice";
import Typing from "./typing";
import Drawing from "./drawing";
import Dino from "./dino";
import Snake from "./snake";

import dice1 from "./images/dice-img-1.png";
import dice2 from "./images/dice-img-2.png";
import dice3 from "./images/dice-img-3.png";
import dice4 from "./images/dice-img-4.png";
import dice5 from "./images/dice-img-5.png";
import dice6 from "./images/dice-img-6.png";


export const dataSections = [
    Home, Number, Dice, Typing,
    Drawing, Dino, Snake
];

export const headerData = [
    {
        id: 1,
        name: "number",
        color: "#3b991f"
    },

    {
        id: 2,
        name: "dice",
        color: "#c91a0e"
    },

    {
        id: 3,
        name: "typing",
        color: "#fcba03"
    },

    {
        id: 4,
        name: "drawing",
        color: "#4287f5"
    },

    {
        id: 5,
        name: "dino",
        color: "#a3a19e"
    },

    {
        id: 6,
        name: "snake",
        color: "#bfff00"
    }
];

export const headerDataLogo = [
    {
        id: 1,
        name: "number",
        rotation: "300"
    },

    {
        id: 2,
        name: "dice",
        rotation: "160"
    },

    {
        id: 3,
        name: "typing",
        rotation: "230"
    },

    {
        id: 4,
        name: "drawing",
        rotation: "50"
    },

    {
        id: 5,
        name: "dino",
        rotation: "20"
    },

    {
        id: 6,
        name: "snake",
        rotation: "320"
    }
];

export const diceData = [
    {
        id: 1,
        name: "",
        points: 0
    },

    {
        id: 2,
        name: "",
        points: 0
    }
];

export const diceDataDice = [
    dice1, dice2, dice3,
    dice4, dice5, dice6
];

export const typingData = [
    "The delicious aroma from the kitchen was ruined by cigarette smoke.",
    "He learned the hardest lesson of his life and had the scars, both physical and mental, to prove it.",
    "His thought process was on so many levels that he gave himself a phobia of heights.",
    "The irony of the situation wasn't lost on anyone in the room.",
    "When he asked her favorite number, she answered without hesitation that it was diamonds.",
    "The clouds formed beautiful animals in the sky that eventually created a tornado to wreak havoc.",
    "That was how he came to win $1 million.",
    "When I was little I had a car door slammed shut on my hand and I still remember it quite vividly.",
    "As the asteroid hurtled toward earth, Becky was upset her dentist appointment had been canceled.",
    "Weather is not trivial - it's especially important when you're standing in it."
];

export const drawingData = [
    {
        id: 1,
        type: "number",
        name: "lineWidth",
        label: "line width",
        placeholder: "e.g. 10"
    },

    {
        id: 2,
        type: "color",
        name: "lineColor",
        label: "color"
    },

    {
        id: 3,
        type: "color",
        name: "bgColor",
        label: "background color"
    },

    {
        id: 4,
        type: "checkbox",
        name: "isErase",
        label: "erase"
    },

    {
        id: 5,
        type: "select",
        name: "currentLineType",
        label: "line type"
    },
    
    {
        id: 6,
        type: "select",
        name: "currentMode",
        label: "drawing mode"
    }
];