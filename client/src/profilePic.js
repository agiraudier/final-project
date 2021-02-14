export function ProfilePic(props) {
    console.log(props);

    return (
        <div onClick={() => this.toggleUploader()}>
            <img
                src={props.profilePicUrl || "./default.png"}
                alt={`${props.firstName}`}
            ></img>
        </div>
    );
}
