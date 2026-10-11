import './Logo.css'

function Logo() {
    return (
        <div className='logo'>
            <img src='/favicon.svg' alt='' className='logo-small'/>
            <span className='logo-name'>ChoreQuest</span>
        </div>
    );
}

export default Logo;
