import './Header.css'
import type {ReactNode} from "react";

function Header({title, children}: {title: string, children: ReactNode}) {
    return (
        <header className='outer-container'>
            <section className='inner-container quest-board'>
                <div className='page-title-wrapper'>
                    <h1>
                        {title}
                    </h1>
                </div>
                {children}
            </section>
        </header>
    );
}

export default Header;