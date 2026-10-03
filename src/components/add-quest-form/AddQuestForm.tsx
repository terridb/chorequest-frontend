import './AddQuestForm.css'
import {useState} from "react";
import SegmentedControl from "../segmented-control/SegmentedControl.tsx";
import type {AssignmentStrategy, Effort, Frequency} from "../../types/enums.ts";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {EffortDetail} from "../../types/task.ts";
import {capitalize} from "../../utils/textUtils.ts";
import EffortMeter from "../effort-meter/EffortMeter.tsx";
import OptionCard from "../option-card/OptionCard.tsx";
import Spinner from "../spinner/Spinner.tsx";
import OptionContainer from "../option-container/OptionContainer.tsx";

function AddQuestForm() {
    const REPEAT_MODE_OPTIONS = [
        {value: 'AS_NEEDED', label: 'As needed'},
        {value: 'ONCE', label: 'Once'},
        {value: 'REPEATS', label: 'Repeats'},
    ] as const;

    const ASSIGNMENT_OPTIONS = [
        {value: 'SOLO', label: 'One person'},
        {value: 'ROTATING', label: 'Rotate'},
    ] as const

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

    const EFFORT_HINTS: Record<Effort, string> = {
        NONE: 'Just needs tracking',
        SMALL: 'Under 10 min',
        MEDIUM: '10-30 min',
        BIG: '30 min or more',
    };

    const ASSIGNMENT_HINTS: Record<AssignmentStrategy, string> = {
        SOLO: 'Same person every time',
        ROTATING: 'Takes turns, in order'
    }

    const FREQUENCY_HINTS: Record<Frequency, string> = {
        AS_NEEDED: 'No schedule',
        ONCE: 'One-time quest',
        DAILY: 'Daily',
        EVERY_OTHER_DAY: 'Every two days',
        EVERY_THREE_DAYS: 'Every three days',
        EVERY_FOUR_DAYS: 'Every four days',
        WEEKLY: 'Weekly',
        EVERY_OTHER_WEEK: 'Every two weeks',
        MONTHLY: 'Monthly',
        EVERY_TWO_MONTHS: 'Every two months',
        EVERY_THREE_MONTHS: 'Every three months',
        EVERY_SIX_MONTHS: 'Every six months',
        YEARLY: 'Yearly',
    }

    type FrequencyUnit = typeof FREQUENCY_UNIT_OPTIONS[number]['value'];
    type RepeatMode = typeof REPEAT_MODE_OPTIONS[number]['value'];

    const [repeatMode, setRepeatMode] = useState<RepeatMode>('AS_NEEDED');
    const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>('DAYS');
    const [frequency, setFrequency] = useState<Frequency>('DAILY');
    const [effort, setEffort] = useState<Effort>('NONE');
    const [assignmentOption, setAssignmentOption] = useState<AssignmentStrategy>('SOLO');

    const {data: efforts, isLoading: isEffortsLoading, isError: isEffortsError} = useQuery({
        queryKey: ["efforts"],
        queryFn: () =>
            apiClient.get<EffortDetail[]>(`/api/efforts`).then(res => res.data),
        staleTime: Infinity,
    })

    return (
        <form className='add-quest-form'>
            {isEffortsLoading && <Spinner/>}
            {!isEffortsLoading && !isEffortsError &&
                <>
                    <label className='form-label' htmlFor="title">
                        Title
                        <input type='text' placeholder='What needs to be done?'/>
                    </label>
                    <label className='form-label'>
                        Description
                        <textarea placeholder='Optional details'/>
                    </label>
                    <div className='form-label-row'>
                        <h6 className='form-label'>Repeats</h6>
                        <p className='form-label-hint'>
                            {repeatMode === 'REPEATS' ? FREQUENCY_HINTS[frequency] : FREQUENCY_HINTS[repeatMode]}
                        </p>
                    </div>
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
                    <div className='form-label-row'>
                        <h6 className='form-label'>Effort</h6>
                        <p className='form-label-hint'>{EFFORT_HINTS[effort]}</p>
                    </div>
                    <OptionContainer>
                        {efforts?.map((item) => (
                            <OptionCard
                                key={item.effort}
                                icon={<EffortMeter effort={item.effort}/>}
                                value={`+${item.points}`}
                                label={capitalize(item.effort)}
                                selected={item.effort === effort}
                                onClick={() => setEffort(item.effort)}
                            />
                        ))}
                    </OptionContainer>
                    <div className='form-label-row'>
                        <h6 className='form-label'>Who does it</h6>
                        <p className='form-label-hint'>{ASSIGNMENT_HINTS[assignmentOption]}</p>
                    </div>
                    <div className='segmented-control-container'>
                        <SegmentedControl options={ASSIGNMENT_OPTIONS} value={assignmentOption} onChange={setAssignmentOption}/>
                    </div>
                </>
            }
        </form>
    );
}

export default AddQuestForm;
