import { useState, useRef, useEffect } from "react";

export function Canvas() {
    //const [elem, setElem] = useState([]);
    const [elemType, setElemType] = useState("line");
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        contextRef.current = context;
        context.strokeStyle = "black";
        context.lineWidth = 2;
    }, []);

    const drawLine = (x1, y1, x2, y2) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(x1, y1);
        contextRef.current.lineTo(x2, y2);
        contextRef.current.stroke();
        contextRef.current.closePath();
    };

    const handleMouseDown = ({ nativeEvent }) => {
        setIsDrawing(true);
        if (elemType == "free") {
            const x = nativeEvent.offsetX;
            const y = nativeEvent.offsetY;
            console.log("handlemouseDown free: ", x, y);

            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
        } else if (elemType == "line") {
            const x = nativeEvent.offsetX;
            const y = nativeEvent.offsetY;

            console.log("handlemousedown line: ", x, y);

            contextRef.current.clearRect(
                0,
                0,
                canvasRef.width,
                canvasRef.height
            );
        }
    };

    const handleMouseMove = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }

        if (elemType == "free") {
            const x = nativeEvent.offsetX;
            const y = nativeEvent.offsetY;

            contextRef.current.lineTo(x, y);
            contextRef.current.stroke();
        } else if (elemType == "line") {
            const x = nativeEvent.offsetX;
            const y = nativeEvent.offsetY;

            console.log("handlemove line: ", x, y);
        }
    };

    const handleMouseUp = ({ nativeEvent }) => {
        setIsDrawing(false);

        if (elemType == "free") {
            contextRef.current.closePath();
        } else if (elemType == "line") {
            const x2 = nativeEvent.offsetX;
            const y2 = nativeEvent.offsetY;
            console.log("handleup line: ", x2, y2);
            drawLine(x2, y2);
        }
    };

    const handleMouseOut = () => {
        setIsDrawing(false);
        if (elemType == "free") {
            contextRef.current.closePath();
        } else if (elemType == "line") {
            contextRef.current.closePath();
        }
    };

    /*const canvas = document.getElementById("signature");
const context = canvas.getContext("2d");
const form = document.getElementById("form");
const inputArea = document.getElementById("canvas");

let isDrawing = false;
let x = 0;
let y = 0;

let drawLine = (e) => {
    if (!isDrawing) return;
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    //context.moveTo(x1, y1);
    //context.lineTo(x2, y2);
    context.moveTo(x, y);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    context.closePath();
    x = e.offsetX;
    y = e.offsetY;
};

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    x = e.offsetX;
    y = e.offsetY;
});

canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));
*/

    return (
        <div>
            <div>
                <input
                    type="radio"
                    id="line"
                    checked={elemType == "line"}
                    onChange={() => setElemType("line")}
                ></input>
                <label htmlFor="line">Line</label>
                <input
                    type="radio"
                    id="rectangle"
                    checked={elemType == "rectangle"}
                    onChange={() => setElemType("rectangle")}
                ></input>
                <label htmlFor="rectangle">Rectangle</label>
                <input
                    type="radio"
                    id="free"
                    checked={elemType == "free"}
                    onChange={() => setElemType("free")}
                ></input>
                <label htmlFor="free">Free</label>
                <input
                    type="radio"
                    id="circle"
                    checked={elemType == "circle"}
                    onChange={() => setElemType("circle")}
                ></input>
                <label htmlFor="circle">Circle</label>
            </div>
            <canvas
                id="canvas"
                width="300"
                height="300"
                ref={canvasRef}
                onMouseDown={(e) => handleMouseDown(e)}
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseUp={(e) => handleMouseUp(e)}
                onMouseOut={() => handleMouseOut()}
            ></canvas>
        </div>
    );
}
