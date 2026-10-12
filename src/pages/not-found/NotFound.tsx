import './NotFound.css'
import Logo from "../../components/ui/logo/Logo.tsx";

const GRID = [
    ['', '', '', '', 'start', ''],
    ['', '', 'path', 'path', '', ''],
    ['', '', 'path', 'path', 'path', ''],
    ['', '', '', 'path', '', ''],
    ['', '', '', 'end', '', ''],
];

function NotFound() {
    return (
        <div className='not-found-page'>
            <header className='outer-container header-welcome'>
                <div className='inner-container'>
                    <Logo/>
                </div>
            </header>
            <main className='outer-container not-found'>
                <div className='not-found-grid'>
                    {GRID.flat().map((tile, index) => (
                        <span key={index} className={`not-found-tile${tile ? ` not-found-tile--${tile}` : ''}`}/>
                    ))}
                </div>
                <p className='not-found-code'>404</p>
                <h1>Page not found</h1>
                <p className='not-found-description'>
                    This screen wandered off. The link may be old, or the page was moved.
                </p>
            </main>
        </div>
    );
}

export default NotFound;
