import { useState, useRef, useEffect } from "react";

export function Canvas() {
    //const [color, setColor] = useState({});
    const [elemType, setElemType] = useState("line");
    const [isDrawing, setIsDrawing] = useState(false);
    const [firstPoint, setFirstPoint] = useState({ x: null, y: null });
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        contextRef.current = context;
        context.strokeStyle = "black";
        context.lineWidth = 2;
    }, []);

    const handleMouseDown = ({ nativeEvent }) => {
        setIsDrawing(true);
        setFirstPoint({
            x: nativeEvent.offsetX,
            y: nativeEvent.offsetY,
        });
        if (elemType == "free") {
            const x = nativeEvent.offsetX;
            const y = nativeEvent.offsetY;
            console.log("handlemouseDown free: ", x, y);

            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
        } else if (elemType == "line") {
            const x = nativeEvent.offsetX;
            const y = nativeEvent.offsetY;
            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
            //contextRef.current.lineTo(x, y);

            console.log("handlemousedown line: ", x, y);
        } else if (elemType == "rectangle") {
            console.log("handle mouse down rectangle: ");
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
            console.log(x, y);
        } else if (elemType == "rectangle") {
            console.log("moving rectangle");
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

            contextRef.current.lineTo(x2, y2);
            contextRef.current.stroke();
            contextRef.current.closePath();
        } else if (elemType == "rectangle") {
            const x1 = firstPoint.x;
            const y1 = firstPoint.y;
            console.log("handlemouse up rectangle get from state: ", x1, y1);

            const x2 = nativeEvent.offsetX;
            const y2 = nativeEvent.offsetY;

            console.log("handlemouse up rectangle current: ", x2, y2);

            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);

            //need 4 states to solve bug in drawing direction

            if (x2 >= x1 && y2 >= y1) {
                contextRef.current.strokeRect(x1, y1, width, height);
            } else if (x2 >= x1 && y2 < y1) {
                contextRef.current.strokeRect(x1, y1 - height, width, height);
            } else if (x2 < x1 && y2 < y1) {
                contextRef.current.strokeRect(x2, y2, width, height);
            } else {
                contextRef.current.strokeRect(x1 - width, y1, width, height);
            }

            setFirstPoint({
                x: null,
                y: null,
            });
        }
    };

    const handleMouseOut = ({ nativeEvent }) => {
        setIsDrawing(false);
        if (elemType == "free") {
            contextRef.current.closePath();
        } else if (elemType == "line") {
            const x2 = nativeEvent.offsetX;
            const y2 = nativeEvent.offsetY;
            console.log("handleup line: ", x2, y2);
            // drawLine(x2, y2);
            //contextRef.current.lineTo(x2, y2);
            //contextRef.current.closePath();

            contextRef.current.closePath();
            contextRef.current.stroke();
        }
    };

    return (
        <div>
            <div>
                <input
                    type="radio"
                    id="free"
                    checked={elemType == "free"}
                    onChange={() => setElemType("free")}
                ></input>
                <label htmlFor="free">Free</label>
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
                    id="circle"
                    checked={elemType == "circle"}
                    onChange={() => setElemType("circle")}
                ></input>
                <label htmlFor="circle">Circle</label>
                <input
                    type="color"
                    id="color"
                    checked={elemType == "color"}
                    onChange={() => setElemType("color")}
                ></input>
            </div>
            <canvas
                id="canvas"
                width="600"
                height="600"
                ref={canvasRef}
                onMouseDown={(e) => handleMouseDown(e)}
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseUp={(e) => handleMouseUp(e)}
                onMouseOut={(e) => handleMouseOut(e)}
            ></canvas>
        </div>
    );
}
