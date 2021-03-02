export function Side(props) {
    return (
        <div className="sideBox">
            <h3 className="side">
                {props.firstName}_{props.lastName}
            </h3>
        </div>
    );
}
