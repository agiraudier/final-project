export function ProfilePic({
    firstName,
    lastName,
    profilePicUrl,
    toggleUploader,
}) {
    /*console.log(
        "first name and last name from profilePic: ",
        firstName,
        lastName
    );*/

    return (
        <div className="Location" onClick={toggleUploader}>
            <div className="profileBox">
                <img
                    className="profilePic"
                    src={profilePicUrl || "./default.png"}
                    alt={`${firstName} ${lastName}`}
                ></img>
            </div>
        </div>
    );
}
