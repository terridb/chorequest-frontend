import './Header.css'
import type {ReactNode} from "react";

function Header({title, toolbar, aside, children}: {
    title: string;
    toolbar?: ReactNode;
    aside?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <header className='outer-container'>
            <section className='inner-container quest-board'>
                {toolbar && <div className='header-toolbar'>{toolbar}</div>}
                <div className='page-title-row'>
                    <div className='page-title-wrapper'>
                        <h1>
                            {title}
                        </h1>
                    </div>
                    {aside && <div className='page-title-aside'>{aside}</div>}
                </div>
                {children}
            </section>
        </header>
    );
}

export default Header;
