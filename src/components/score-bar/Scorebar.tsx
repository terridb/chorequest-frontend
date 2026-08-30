import './Scorebar.css'

function Scorebar({title}: {title: string}) {
    return (
        <div className='score-bar-wrapper'>
            <div className='score-bar-title-wrapper'>
                <span>{title}</span>
                <div className='score-bar-points-wrapper'>
                    <span className='score-bar-points-current'>200</span>
                    <span className='score-bar-points-goal'>/500</span>
                </div>
            </div>
            <div className='score-bar'>
                <span className='score-bar-block'></span>
                <span className='score-bar-block inactive'></span>
            </div>
        </div>
    );
}

export default Scorebar;