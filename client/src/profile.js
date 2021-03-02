import { ProfilePic } from "./profilePic";
import { BioEditor } from "./bioEditor";
//import { Uploader } from "./uploader";

export function Profile(props) {
    console.log("this are the props in Profile: ", props);

    return (
        <div>
            <ProfilePic
                // Passing down props:
                id={props.id}
                firstName={props.firstName}
                lastName={props.lastName}
                profilePicUrl={props.profilePicUrl}
                toggleUploader={props.toggleUploader}
            />

            <BioEditor bio={props.bio} />
        </div>
    );
}
