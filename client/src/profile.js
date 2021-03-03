import { ProfilePic } from "./profilePic";
import { BioEditor } from "./bioEditor";
import { Images } from "./images.js";
//import { Uploader } from "./uploader";

export function Profile(props) {
    console.log("this are the props in Profile: ", props);

    return (
        <div>
            <div className="picInProfile">
                <ProfilePic
                    // Passing down props:
                    id={props.id}
                    firstName={props.firstName}
                    lastName={props.lastName}
                    profilePicUrl={props.profilePicUrl}
                    toggleUploader={props.toggleUploader}
                />
            </div>

            <BioEditor bio={props.bio} />
            <Images id={props.id}></Images>
        </div>
    );
}
