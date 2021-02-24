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
        <div onClick={toggleUploader}>
            <img
                src={profilePicUrl || "./default.png"}
                alt={`${firstName} ${lastName}`}
            ></img>
        </div>
    );
}
