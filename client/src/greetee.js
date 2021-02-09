// src/greetee.js
export default function Greetee(props) {
    //console.log("props in greetee: ", props);
    return <span>{props.firstName || "AWESOME_USER"}</span>;
}
