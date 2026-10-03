import './Avatar.css'
import {useState} from "react";
import {getAvatarColorVar} from "../../utils/avatar.ts";

function Avatar({src, name, seed, selected = false}: { src?: string; name: string; seed: string; selected?: boolean }) {
    const [imageFailed, setImageFailed] = useState(false);

    if (src && !imageFailed) {
        return (
            <img
                src={src}
                alt={`Avatar of ${name}`}
                className={`avatar${selected ? '' : ' avatar--unselected'}`}
                onError={() => setImageFailed(true)}
            />
        );
    }

    return (
        <span
            className={`avatar avatar-fallback${selected ? ' avatar-fallback--selected' : ''}`}
            style={selected ? {backgroundColor: getAvatarColorVar(seed)} : undefined}
        >
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export default Avatar;
