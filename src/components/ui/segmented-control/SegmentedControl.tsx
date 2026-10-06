import './SegmentedControl.css'


function SegmentedControl<T extends string>({options, value, onChange, variant = 'default'}: {
    options: readonly { value: T, label: string }[];
    value: T;
    onChange: (value: T) => void;
    variant?: 'default' | 'inverted';
}) {
    return (
        <div className={variant === 'inverted' ? 'segmented-control segmented-control--inverted' : 'segmented-control'}>
            {options.map(option => (
                <button
                    key={option.value}
                    type='button'
                    className={option.value === value ? 'segmented-control-option active' : 'segmented-control-option'}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export default SegmentedControl;