import { ProfilePic } from "./profilePic";
import { BioEditor } from "./bioEditor";

export default function Profile(props) {
    console.log("this are the props in Profile: ", props);
    return (
        <div>
            <h2>
                Hello, {props.firstName}
                {props.lastName}!
            </h2>
            <ProfilePic
                // Passing down props:
                id={props.id}
                firstName={props.firstName}
                lastName={props.lastName}
                profilePicUrl={props.profilePicUrl}
            />
            <BioEditor bio={props.bio} />
        </div>
    );
}
