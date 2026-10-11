import type {SVGProps} from "react";

function PixelIcon({children, ...props}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 12 12"
            fill="currentColor"
            shapeRendering="crispEdges"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {children}
        </svg>
    );
}

export function LeaderboardIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="5" y="4" width="3" height="1"/>
            <rect x="5" y="5" width="3" height="1"/>
            <rect x="5" y="6" width="3" height="1"/>
            <rect x="9" y="6" width="3" height="1"/>
            <rect x="5" y="7" width="3" height="1"/>
            <rect x="9" y="7" width="3" height="1"/>
            <rect x="1" y="8" width="3" height="1"/>
            <rect x="5" y="8" width="3" height="1"/>
            <rect x="9" y="8" width="3" height="1"/>
            <rect x="1" y="9" width="3" height="1"/>
            <rect x="5" y="9" width="3" height="1"/>
            <rect x="9" y="9" width="3" height="1"/>
            <rect x="1" y="10" width="3" height="1"/>
            <rect x="5" y="10" width="3" height="1"/>
            <rect x="9" y="10" width="3" height="1"/>
            <rect x="1" y="11" width="3" height="1"/>
            <rect x="5" y="11" width="3" height="1"/>
            <rect x="9" y="11" width="3" height="1"/>
        </PixelIcon>
    );
}

export function CartIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="1" y="1" width="1" height="1"/>
            <rect x="1" y="2" width="2" height="1"/>
            <rect x="2" y="3" width="9" height="1"/>
            <rect x="2" y="4" width="9" height="1"/>
            <rect x="2" y="5" width="9" height="1"/>
            <rect x="3" y="6" width="7" height="1"/>
            <rect x="3" y="9" width="1" height="1"/>
            <rect x="8" y="9" width="1" height="1"/>
            <rect x="3" y="10" width="1" height="1"/>
            <rect x="8" y="10" width="1" height="1"/>
        </PixelIcon>
    );
}

export function QuestsIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="2" y="2" width="8" height="1"/>
            <rect x="2" y="3" width="8" height="1"/>
            <rect x="2" y="4" width="6" height="1"/>
            <rect x="9" y="4" width="1" height="1"/>
            <rect x="2" y="5" width="1" height="1"/>
            <rect x="4" y="5" width="3" height="1"/>
            <rect x="8" y="5" width="2" height="1"/>
            <rect x="2" y="6" width="2" height="1"/>
            <rect x="5" y="6" width="1" height="1"/>
            <rect x="7" y="6" width="3" height="1"/>
            <rect x="2" y="7" width="3" height="1"/>
            <rect x="6" y="7" width="4" height="1"/>
            <rect x="2" y="8" width="8" height="1"/>
            <rect x="2" y="9" width="8" height="1"/>
        </PixelIcon>
    );
}

export function SettingsIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="5" y="1" width="2" height="1"/>
            <rect x="4" y="2" width="4" height="1"/>
            <rect x="3" y="3" width="6" height="1"/>
            <rect x="2" y="4" width="8" height="1"/>
            <rect x="1" y="5" width="4" height="1"/>
            <rect x="7" y="5" width="4" height="1"/>
            <rect x="1" y="6" width="4" height="1"/>
            <rect x="7" y="6" width="4" height="1"/>
            <rect x="2" y="7" width="8" height="1"/>
            <rect x="3" y="8" width="6" height="1"/>
            <rect x="4" y="9" width="4" height="1"/>
            <rect x="5" y="10" width="2" height="1"/>
        </PixelIcon>
    );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="10" y="2" width="1" height="1"/>
            <rect x="9" y="3" width="2" height="1"/>
            <rect x="8" y="4" width="2" height="1"/>
            <rect x="1" y="5" width="2" height="1"/>
            <rect x="7" y="5" width="2" height="1"/>
            <rect x="2" y="6" width="2" height="1"/>
            <rect x="6" y="6" width="2" height="1"/>
            <rect x="3" y="7" width="4" height="1"/>
            <rect x="4" y="8" width="2" height="1"/>
        </PixelIcon>
    );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="5" y="2" width="2" height="1"/>
            <rect x="5" y="3" width="2" height="1"/>
            <rect x="5" y="4" width="2" height="1"/>
            <rect x="2" y="5" width="8" height="1"/>
            <rect x="2" y="6" width="8" height="1"/>
            <rect x="5" y="7" width="2" height="1"/>
            <rect x="5" y="8" width="2" height="1"/>
            <rect x="5" y="9" width="2" height="1"/>
        </PixelIcon>
    );
}

export function CrossIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <PixelIcon {...props}>
            <rect x="2" y="2" width="2" height="1"/>
            <rect x="8" y="2" width="2" height="1"/>
            <rect x="3" y="3" width="2" height="1"/>
            <rect x="7" y="3" width="2" height="1"/>
            <rect x="4" y="4" width="4" height="1"/>
            <rect x="5" y="5" width="2" height="2"/>
            <rect x="4" y="7" width="4" height="1"/>
            <rect x="3" y="8" width="2" height="1"/>
            <rect x="7" y="8" width="2" height="1"/>
            <rect x="2" y="9" width="2" height="1"/>
            <rect x="8" y="9" width="2" height="1"/>
        </PixelIcon>
    );
}
