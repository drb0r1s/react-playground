import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { drawingData } from "./data";
import modalX from "./images/dice-modal-x.svg";
import useResponsiveObj from "./useResponsiveObj";

const Drawing = (props) => {
    const [returnShadow, setReturnShadow] = useState(false);
    const [canvas, setCanvas] = useState("");
    const [firstRect, setFirstRect] = useState(true);
    const [saveCanvas, setSaveCanvas] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    const [saveInputs, setSaveInputs] = useState({
        fileName: "playground-drawing", fileType: "jpg"
    });
    
    const drawingModes = [
        "normal", "ruler", "fixed",
        "rect", "fixed rect", "filled rect",
        "circle", "fixed circle"
    ];

    const lineTypes = ["default", "round", "square"];

    const allSelect = [drawingModes, lineTypes];
    
    const defaultSettings = useMemo(() => {
        return {
            lineWidth: "", lineColor: "#000000", bgColor: "#e1e5eb",
            isErase: false, currentMode: "normal", currentLineType: "default"
        }
    }, []);
    
    const [settings, setSettings] = useState(defaultSettings);

    const {
        lineWidth, lineColor, bgColor,
        isErase, currentMode, currentLineType
    } = settings;
    
    const allSettings = Object.values(settings);
    
    const drawingH2 = useRef(null);
    const canvasRef = useRef(null);
    const downloadModal = useRef(null);
    const download = useRef(null);
    const downloadSuccess = useRef(null);

    useEffect(() => {
        const makeCanvas = canvasRef.current;
        setCanvas(makeCanvas);
    }, []);

    const canvasResponsive = useMemo(() => {
        return {
            xxs: { width: "220", height: "400" },
            xs: { width: "250", height: "400" },
            sm: { width: "400", height: "400" },
            md: { width: "600", height: "400" },
            lg: { width: "800", height: "400" },
            xl: { width: "1000", height: "400" },
            xxl: { width: "1500", height: "500" }
        };
    }, []);
    
    const { responsive } = useResponsiveObj(canvasResponsive);

    function mouseOver(event) {
        window.addEventListener("mousemove", mouseMove);
        drawingH2.current.addEventListener("mouseleave", mouseLeave);

        const prevX = event.clientX;
        const prevY = event.clientY;

        function mouseMove(event) {
            const newX = prevX - event.clientX;
            const newY = prevY - event.clientY;
            
            const blur = "2px";
            const color = "rgba(0, 0, 0, 0.5)";

            drawingH2.current.style.textShadow = `${newX}px ${newY}px ${blur} ${color}`;
        }

        function mouseLeave() {
            window.removeEventListener("mousemove", mouseMove);
            drawingH2.current.removeEventListener("mouseleave", mouseLeave);

            setReturnShadow(true);

            setTimeout(() => {
                setReturnShadow(false);
                drawingH2.current.style.textShadow = "";
            }, 300);
        }
    }

    const startCanvas = useCallback((event) => {
        const ctx = canvas.getContext("2d");
        
        canvas.addEventListener("mousemove", mouseMove);
        canvas.addEventListener("mouseup", mouseUp);

        canvas.addEventListener("touchmove", mouseMove, { passive: false });
        canvas.addEventListener("touchend", mouseUp);

        const eraseCheck = isErase ?
            bgColor ? bgColor : "white"
        : lineColor;
            
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = eraseCheck;
        
        if(firstRect && bgColor !== "#e1e5eb") {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            setFirstRect(false);
        }
        
        canvas.style.background = bgColor === "#e1e5eb" ?
            "rgba(255, 255, 255, 0.5)"
        : bgColor;

        const downEvent = event.type === "mousedown";

        const canvasTarget = event.target.getBoundingClientRect();
        
        const chooseX = downEvent ? event.nativeEvent.offsetX : canvasTarget.x;
        const chooseY = downEvent ? event.nativeEvent.offsetY : canvasTarget.y;
        
        const prevX = chooseX;
        const prevY = chooseY;

        let newX, newY;
        
        ctx.beginPath();

        function mouseMove(event) {   
            event.preventDefault();
            
            const moveEvent = event.type === "mousemove";
            
            const chooseNewX = moveEvent ? event.offsetX : event.targetTouches[0].clientX;
            const chooseNewY = moveEvent ? event.offsetY : event.targetTouches[0].clientY;
            
            newX = moveEvent ? chooseNewX : chooseNewX - prevX;
            newY = moveEvent ? chooseNewY : chooseNewY - prevY;

            switch(currentLineType) {
                case "default":
                    ctx.lineCap = "butt";

                    break;                
                case "round":
                    ctx.lineCap = "round";
                    
                    break;
                case "square":
                    ctx.lineCap = "square";

                    break;
                default: console.log("No such line type!");
            }
            
            switch(currentMode) {
                case "normal":
                    ctx.lineTo(newX, newY);
                    ctx.stroke();

                    break;
                case "ruler":
                    
                    break;
                case "fixed":
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(newX, newY);
                    ctx.stroke();
                    ctx.closePath();

                    break;
                case "rect":
                    
                    break;
                case "fixed rect":
                    ctx.rect(prevX, prevY, newX - prevX, newY - prevY);
                    ctx.stroke();
                
                    break;
                case "filled rect":
                    ctx.fillStyle = eraseCheck;
                    ctx.fillRect(prevX, prevY, newX - prevX, newY - prevY);

                    break;
                case "circle":

                    break;
                case "fixed circle":
                    const radius = newX - prevX < 0 ? 0 : newX - prevX;
                
                    ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                    
                    break;
                default: console.log("No such drawing mode!");
            }
        }

        function mouseUp() {
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);

            canvas.removeEventListener("touchmove", mouseMove);
            canvas.removeEventListener("touchend", mouseUp);

            if(currentMode === "ruler") {
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(newX, newY);
                ctx.stroke();
                ctx.closePath();
            }

            if(currentMode === "rect") {
                ctx.rect(prevX, prevY, newX - prevX, newY - prevY);
                ctx.stroke();
            }
            
            if(currentMode === "circle") {
                const radius = newX - prevX < 0 ? 0 : newX - prevX;
                
                ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }, [bgColor, canvas, currentLineType, currentMode, firstRect, isErase, lineColor, lineWidth]);

    useEffect(() => {
        if(canvas) {
            window.addEventListener("touchstart", startCanvas, { passive: false });

            return () => { window.removeEventListener("touchstart", startCanvas, { passive: false }) }
        }
    }, [canvas, startCanvas]);

    function resetCanvas() {
        setSettings({
            lineWidth: "", lineColor: "#000000", bgColor: "#e1e5eb",
            isErase: false, currentMode: "normal", currentLineType: "default"
        });

        canvas.style.background = "";

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function changeInput(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        
        const checkedName = event.target.type === "checkbox" ? event.target.name : null;
        const inputChecked = event.target.checked;

        const selectName = event.target.type === "select" ? event.target : null;
        
        if(checkedName !== null) {
            return setSettings({
                ...settings,
                [checkedName]: inputChecked
            });
        }

        if(selectName !== null) {
            const selectedName = event.target.name === "currentMode" ? currentMode : currentLineType;
            const selectedOption = selectName.options[selectName.selectedIndex].text;
            
            return setSettings({
                ...settings,
                [selectedName]: selectedOption
            });
        }
        
        if(inputName === "bgColor") setFirstRect(true);
        
        setSettings({
            ...settings,
            [inputName]: inputValue
        });
    }

    function changeSaveInputs(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setSaveInputs({...saveInputs, [inputName]: inputValue});
    }

    function openModal() {
        setSaveCanvas(true);

        setTimeout(() => {
            downloadModal.current.style.opacity = "1";
            downloadModal.current.style.top = "50%";
        }, 100);
    }
    
    function closeModal() {
        downloadModal.current.style.opacity = "0";
        downloadModal.current.style.top = "40%";

        setTimeout(() => {
            setSaveCanvas(false);
            setIsDownloaded(false);
        }, 500);
    }

    function changeDownloadStatus() {
        download.current.style.opacity = "0";
        download.current.style.top = "20px";

        setTimeout(() => {
            setIsDownloaded(true);

            setTimeout(() => {
                downloadSuccess.current.style.opacity = "1";
                downloadSuccess.current.style.top = "0";
            }, 100);
        }, 500);
    }
    
    return(
        <div className="drawing" id="drawing" ref={props.setRef}>
            {saveCanvas && <DownloadModal
                {...saveInputs}
                changeSaveInputs={changeSaveInputs}
                canvas={canvas}
                closeModal={closeModal}
                downloadModal={downloadModal}
                isDownloaded={isDownloaded}
                download={download}
                downloadSuccess={downloadSuccess}
                changeDownloadStatus={changeDownloadStatus}
            />}
            
            <h2
                id={returnShadow ? "return-shadow" : ""}
                ref={drawingH2}
                onMouseOver={mouseOver}
            >drawing</h2>

            <canvas
                id="canvas"
                ref={canvasRef}
                height={responsive.height ? responsive.height : "400"}
                width={responsive.width ? responsive.width : "1000"} 
                onMouseDown={startCanvas}
            ></canvas>

            <div className="dashboard">
                {drawingData.map((input, index) => {
                    const selectName = input.name === "currentMode" ?
                        allSelect[0]
                    : allSelect[1];
                    
                    if(input.type === "select") {
                        return <div key={input.id} className="option">
                            <label htmlFor={input.name}>{input.label}:</label>

                            <select
                                name={input.name}
                                id={input.name}
                                onChange={changeInput}
                            >
                                {selectName.map((mode, index) => {
                                    return <option
                                        key={index}
                                        value={mode}
                                    >{mode}</option>
                                })}
                            </select>
                        </div>
                    }
                    
                    return <div
                        key={input.id}
                        className="option"
                    >
                        <label htmlFor={input.name}>{input.label}:</label>
                        
                        <input
                            type={input.type === undefined ? "text" : input.type}
                            name={input.name}
                            id={input.name}
                            placeholder={input.placeholder}
                            max={input.type === "number" ? "100" : null}
                            min={input.type === "number" ? "0" : null}
                            value={allSettings[index]}
                            onChange={changeInput}
                        />
                    </div>;
                })}

                <button onClick={openModal}>save</button>
                <button onClick={resetCanvas}>reset</button>
            </div>
        </div>
    );
}

const DownloadModal = (props) => {
    const {
        downloadModal, isDownloaded, closeModal
    } = props;
    
    return(
        <div className="download-modal" ref={downloadModal}>
            <img
                src={modalX}
                alt="X"
                onClick={closeModal}
            />
            
            <h3>save image</h3>

            {isDownloaded ? <DownloadSuccess
                {...props}
            /> : <Download
                {...props}
            />}
        </div>
    );
}

const Download = (props) => {
    const {
        download, fileName, fileType,
        changeSaveInputs, canvas, changeDownloadStatus
    } = props;
    
    return(
        <div className="download" ref={download}>
            <div className="input-holder">
                <input
                    type="text"
                    name="fileName"
                    id="file-name"
                    placeholder="name"
                    maxLength="32"
                    value={fileName}
                    onChange={changeSaveInputs}
                />

                <input
                    type="text"
                    name="fileType"
                    id="file-type"
                    placeholder="type"
                    maxLength="4"
                    value={fileType}
                    onChange={changeSaveInputs}
                />
            </div>

            <a
                href={canvas.toDataURL(`image/${fileType}`)}
                download={`${fileName}.${fileType}`}
                onClick={changeDownloadStatus}
            >download</a>
        </div>
    );
}

const DownloadSuccess = (props) => {
    const {
        downloadSuccess, canvas, fileName,
        fileType
    } = props;
    
    return(
        <div className="download-success" ref={downloadSuccess}>
            <strong>Image successfully <span>downloaded</span>!</strong>
            <p>
                Download problem?
                <a
                    href={canvas.toDataURL(`image/${fileType}`)}
                    download={`${fileName}.${fileType}`}
                >download again</a>
            </p>
        </div>
    );
}

export default Drawing;