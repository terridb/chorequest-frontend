import './Avatar.css'
import {type CSSProperties, useState} from "react";
import {getAvatarColorVar} from "../../../utils/avatar.ts";

function Avatar({src, name, seed}: { src?: string; name: string; seed: string }) {
    const [imageFailed, setImageFailed] = useState(false);

    if (src && !imageFailed) {
        return (
            <img
                src={src}
                alt={`Avatar of ${name}`}
                className='avatar'
                onError={() => setImageFailed(true)}
            />
        );
    }

    return (
        <span
            className='avatar avatar-fallback'
            style={{'--avatar-color': getAvatarColorVar(seed)} as CSSProperties}
        >
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export default Avatar;
