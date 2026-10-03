import './AddQuestForm.css'
import {useState} from "react";
import type {AssignmentStrategy, Effort, Frequency} from "../../types/enums.ts";
import type {TaskInput} from "../../types/task.ts";
import type {Household} from "../../types/household.ts";
import {useEfforts} from "../../hooks/useEfforts.ts";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import {formatFrequency} from "../../utils/frequency.ts";
import {toLocalDateString} from "../../utils/date.ts";
import SegmentedControl from "../segmented-control/SegmentedControl.tsx";
import Spinner from "../spinner/Spinner.tsx";
import Button from "../button/Button.tsx";
import FormField from "../form-field/FormField.tsx";
import RepeatPicker from "../repeat-picker/RepeatPicker.tsx";
import EffortPicker from "../effort-picker/EffortPicker.tsx";
import MemberPicker from "../member-picker/MemberPicker.tsx";

const ASSIGNMENT_OPTIONS = [
    {value: 'SOLO', label: 'One person'},
    {value: 'ROTATING', label: 'Rotate'},
] as const satisfies readonly { value: AssignmentStrategy, label: string }[];

const EFFORT_HINTS: Record<Effort, string> = {
    NONE: 'Just needs tracking',
    SMALL: 'Under 10 min',
    MEDIUM: '10-30 min',
    BIG: '30 min or more',
};

const ASSIGNMENT_HINTS: Record<AssignmentStrategy, string> = {
    SOLO: 'Same person every time',
    ROTATING: 'Takes turns, in order',
};

function getRepeatHint(frequency: Frequency): string {
    if (frequency === 'AS_NEEDED') return 'No schedule';
    if (frequency === 'ONCE') return 'One-time quest';
    return formatFrequency(frequency);
}

function AddQuestForm({household}: { household: Household }) {
    const [form, setForm] = useState<TaskInput>({
        title: '',
        description: '',
        effort: 'NONE',
        frequency: 'AS_NEEDED',
        startingDate: toLocalDateString(new Date()),
        alwaysSameDay: false,
        strategy: 'SOLO',
        responsibleMemberId: household.members[0]?.id,
    });

    function updateField<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
        setForm(prev => ({...prev, [key]: value}));
    }

    const {data: efforts, isLoading: isEffortsLoading, isError: isEffortsError} = useEfforts();
    const showSpinner = useDelayedLoading(isEffortsLoading);

    const selectedPoints = efforts?.find(item => item.effort === form.effort)?.points ?? 0;

    return (
        <form className='add-quest-form'>
            {showSpinner && <Spinner/>}
            {isEffortsError &&
                <p>Something went wrong loading the quest options. Please try again.</p>
            }
            {efforts &&
                <>
                    <div className='add-quest-form-fields'>
                        <label className='form-label'>
                            Title
                            <input
                                type='text'
                                placeholder='What needs to be done?'
                                value={form.title}
                                onChange={e => updateField('title', e.target.value)}
                            />
                        </label>
                        <label className='form-label'>
                            Description
                            <textarea
                                placeholder='Optional details'
                                value={form.description ?? ''}
                                onChange={e => updateField('description', e.target.value)}
                            />
                        </label>

                        <FormField label='Repeats' hint={getRepeatHint(form.frequency)}>
                            <RepeatPicker
                                frequency={form.frequency}
                                startingDate={form.startingDate}
                                alwaysSameDay={form.alwaysSameDay ?? false}
                                onFrequencyChange={value => updateField('frequency', value)}
                                onStartingDateChange={value => updateField('startingDate', value)}
                                onAlwaysSameDayChange={value => updateField('alwaysSameDay', value)}
                            />
                        </FormField>

                        <FormField label='Effort' hint={EFFORT_HINTS[form.effort]}>
                            <EffortPicker
                                efforts={efforts}
                                value={form.effort}
                                onChange={value => updateField('effort', value)}
                            />
                        </FormField>

                        <FormField label='Who does it' hint={ASSIGNMENT_HINTS[form.strategy]}>
                            <SegmentedControl
                                options={ASSIGNMENT_OPTIONS}
                                value={form.strategy}
                                onChange={value => updateField('strategy', value)}
                            />
                        </FormField>

                        <FormField label={form.strategy === 'SOLO' ? 'Responsible' : 'Starts with'}>
                            <MemberPicker
                                members={household.members}
                                value={form.responsibleMemberId}
                                onChange={value => updateField('responsibleMemberId', value)}
                            />
                        </FormField>
                    </div>
                    <div className='add-quest-form-footer'>
                        <Button
                            variant='primary'
                            type='submit'
                            size='large'
                        >
                            Post quest +{selectedPoints}
                        </Button>
                    </div>
                </>
            }
        </form>
    );
}

export default AddQuestForm;
