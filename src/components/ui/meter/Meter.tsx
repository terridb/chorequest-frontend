import './Meter.css'

function Meter({filled, total}: { filled: number; total: number }) {
    return (
        <span className='meter'>
            {Array.from({length: total}, (_, i) =>
                <span
                    className={i < filled ? 'meter-square filled' : 'meter-square'}
                    key={i}
                />
            )}
        </span>
    );
}

export default Meter;
