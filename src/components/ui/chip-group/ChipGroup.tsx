import './ChipGroup.css'

function ChipGroup<T extends string>({options, value, onChange}: {
    options: readonly { value: T, label: string }[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <div className='chip-group'>
            {options.map(option => (
                <button
                    key={option.value}
                    type='button'
                    className={option.value === value ? 'chip active' : 'chip'}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export default ChipGroup;
