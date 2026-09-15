import './AddQuestForm.css'
import {useState} from "react";
import SegmentedControl from "../segmented-control/SegmentedControl.tsx";
import type {Frequency} from "../../types/enums.ts";

function AddQuestForm() {
    const REPEAT_MODE_OPTIONS = [
        {value: 'AS_NEEDED', label: 'As needed'},
        {value: 'ONCE', label: 'Once'},
        {value: 'REPEATS', label: 'Repeats'},
    ] as const;

    const FREQUENCIES_BY_UNIT: Record<'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS', { value: Frequency, label: string }[]> = {
        DAYS: [
            {value: 'DAILY', label: '1'},
            {value: 'EVERY_OTHER_DAY', label: '2'},
            {value: 'EVERY_THREE_DAYS', label: '3'},
            {value: 'EVERY_FOUR_DAYS', label: '4'},
        ],
        WEEKS: [
            {value: 'WEEKLY', label: '1'},
            {value: 'EVERY_OTHER_WEEK', label: '2'},
        ],
        MONTHS: [
            {value: 'MONTHLY', label: '1'},
            {value: 'EVERY_TWO_MONTHS', label: '2'},
            {value: 'EVERY_THREE_MONTHS', label: '3'},
        ],
        YEARS: [
            {value: 'YEARLY', label: '1'},
        ],
    };

    const FREQUENCY_UNIT_OPTIONS = [
        {value: 'DAYS', label: 'Days'},
        {value: 'WEEKS', label: 'Weeks'},
        {value: 'MONTHS', label: 'Months'},
        {value: 'YEARS', label: 'Years'},
    ] as const;

    type FrequencyUnit = typeof FREQUENCY_UNIT_OPTIONS[number]['value'];
    type RepeatMode = typeof REPEAT_MODE_OPTIONS[number]['value'];

    const [repeatMode, setRepeatMode] = useState<RepeatMode>('AS_NEEDED');
    const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>('DAYS');
    const [frequency, setFrequency] = useState<Frequency>('DAILY');

    return (
        <form className='add-quest-form'>
            <label className='form-label' htmlFor="title">
                Title
                <input type='text' placeholder='What needs to be done?'/>
            </label>
            <label className='form-label'>
                Description
                <textarea placeholder='Optional details'/>
            </label>
            <h6 className='form-label'>Repeats</h6>
            <div className='segmented-control-container'>
                <SegmentedControl options={REPEAT_MODE_OPTIONS} value={repeatMode} onChange={setRepeatMode}/>
                {repeatMode === 'REPEATS' && (
                    <div className='repeats-container'>
                        <div className='repeats-times-wrapper'>
                            <p>Every</p>
                            {FREQUENCIES_BY_UNIT[frequencyUnit].map(option => (
                                <button
                                    key={option.value}
                                    type='button'
                                    className={option.value === frequency ? 'form-button active' : 'form-button'}
                                    onClick={() => setFrequency(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <SegmentedControl
                            options={FREQUENCY_UNIT_OPTIONS}
                            value={frequencyUnit}
                            onChange={(unit) => {
                                setFrequencyUnit(unit);
                                setFrequency(FREQUENCIES_BY_UNIT[unit][0].value);
                            }}
                            variant='inverted'
                        />
                    </div>
                )}
            </div>
        </form>
    );
}

export default AddQuestForm;
