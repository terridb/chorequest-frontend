import './AddQuestForm.css'
import {Controller, useForm, useWatch} from "react-hook-form";
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
    const {register, control, handleSubmit, setValue, formState: {errors, isValid}} = useForm<TaskInput>({
        // The post button is disabled until the form is valid, so errors can't wait for a submit to show up
        mode: 'onTouched',
        defaultValues: {
            title: '',
            description: '',
            effort: 'NONE',
            frequency: 'AS_NEEDED',
            startingDate: toLocalDateString(new Date()),
            alwaysSameDay: false,
            strategy: 'SOLO',
            responsibleMemberId: household.members[0]?.id,
        },
    });

    const [frequency, startingDate, alwaysSameDay, effort, strategy] =
        useWatch({control, name: ['frequency', 'startingDate', 'alwaysSameDay', 'effort', 'strategy']});

    const {data: efforts, isLoading: isEffortsLoading, isError: isEffortsError} = useEfforts();
    const showSpinner = useDelayedLoading(isEffortsLoading);

    const selectedPoints = efforts?.find(item => item.effort === effort)?.points ?? 0;

    const onSubmit = (data: TaskInput) => {
        // TODO: send to the API with a create task mutation
        console.log('new quest: ', data);
    }

    return (
        <form className='add-quest-form' onSubmit={handleSubmit(onSubmit)}>
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
                                aria-invalid={errors.title ? true : undefined}
                                {...register('title', {
                                    required: 'Title is required',
                                    validate: value => value.trim() !== '' || 'Title is required',
                                    minLength: {value: 2, message: 'Title must be between 2 and 100 characters'},
                                    maxLength: {value: 100, message: 'Title must be between 2 and 100 characters'},
                                })}
                            />
                            {errors.title && <span className='form-error'>{errors.title.message}</span>}
                        </label>
                        <label className='form-label'>
                            Description
                            <textarea
                                placeholder='Optional details'
                                aria-invalid={errors.description ? true : undefined}
                                {...register('description', {
                                    maxLength: {value: 500, message: 'Description must be at most 500 characters'},
                                })}
                            />
                            {errors.description && <span className='form-error'>{errors.description.message}</span>}
                        </label>

                        <FormField label='Repeats' hint={getRepeatHint(frequency)}>
                            <RepeatPicker
                                frequency={frequency}
                                startingDate={startingDate}
                                alwaysSameDay={alwaysSameDay ?? false}
                                onFrequencyChange={value => setValue('frequency', value)}
                                onStartingDateChange={value => setValue('startingDate', value)}
                                onAlwaysSameDayChange={value => setValue('alwaysSameDay', value)}
                            />
                        </FormField>

                        <FormField label='Effort' hint={EFFORT_HINTS[effort]}>
                            <Controller
                                name='effort'
                                control={control}
                                render={({field}) => (
                                    <EffortPicker efforts={efforts} value={field.value} onChange={field.onChange}/>
                                )}
                            />
                        </FormField>

                        <FormField label='Who does it' hint={ASSIGNMENT_HINTS[strategy]}>
                            <Controller
                                name='strategy'
                                control={control}
                                render={({field}) => (
                                    <SegmentedControl options={ASSIGNMENT_OPTIONS} value={field.value}
                                                      onChange={field.onChange}/>
                                )}
                            />
                        </FormField>

                        <FormField label={strategy === 'SOLO' ? 'Responsible' : 'Starts with'}>
                            <Controller
                                name='responsibleMemberId'
                                control={control}
                                render={({field}) => (
                                    <MemberPicker members={household.members} value={field.value}
                                                  onChange={field.onChange}/>
                                )}
                            />
                        </FormField>
                    </div>
                    <div className='add-quest-form-footer'>
                        <Button
                            variant='primary'
                            type='submit'
                            size='large'
                            disabled={!isValid}
                        >
                            Post quest <span className='add-quest-form-points'>+{selectedPoints}</span>
                        </Button>
                    </div>
                </>
            }
        </form>
    );
}

export default AddQuestForm;
