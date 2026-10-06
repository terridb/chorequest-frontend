import {Controller, useForm, useWatch} from "react-hook-form";
import type {AssignmentStrategy, Frequency} from "../../../types/enums.ts";
import type {Task, TaskInput} from "../../../types/task.ts";
import type {Household} from "../../../types/household.ts";
import {useGetEfforts} from "../../../hooks/useGetEfforts.ts";
import {useDelayedLoading} from "../../../hooks/useDelayedLoading.ts";
import {formatFrequency} from "../../../utils/frequency.ts";
import {toLocalDateString} from "../../../utils/date.ts";
import SegmentedControl from "../../ui/segmented-control/SegmentedControl.tsx";
import Spinner from "../../ui/spinner/Spinner.tsx";
import Form from "../../ui/form/Form.tsx";
import LabeledGroup from "../../ui/labeled-group/LabeledGroup.tsx";
import RepeatPicker from "../repeat-picker/RepeatPicker.tsx";
import OptionPicker from "../../ui/option-picker/OptionPicker.tsx";
import Meter from "../../ui/meter/Meter.tsx";
import {EFFORT_HINTS, EFFORT_LEVELS} from "../../../utils/effort.ts";
import {capitalize} from "../../../utils/text.ts";
import {toMemberOptions} from "../../ui/option-picker/memberOptions.tsx";
import {useCreateTask} from "../../../hooks/useCreateTask.ts";
import {useUpdateTask} from "../../../hooks/useUpdateTask.ts";

const ASSIGNMENT_OPTIONS = [
    {value: 'SOLO', label: 'One person'},
    {value: 'ROTATING', label: 'Rotate'},
] as const satisfies readonly { value: AssignmentStrategy, label: string }[];

const ASSIGNMENT_HINTS: Record<AssignmentStrategy, string> = {
    SOLO: 'Same person every time',
    ROTATING: 'Takes turns, in order',
};

function getRepeatHint(frequency: Frequency): string {
    if (frequency === 'AS_NEEDED') return 'No schedule';
    if (frequency === 'ONCE') return 'One-time quest';
    return formatFrequency(frequency);
}

function emptyTaskInput(household: Household): TaskInput {
    return {
        title: '',
        description: '',
        effort: 'NONE',
        frequency: 'AS_NEEDED',
        startingDate: toLocalDateString(new Date()),
        alwaysSameDay: false,
        strategy: 'SOLO',
        responsibleMemberId: household.members[0]?.id,
    };
}

function toTaskInput(task: Task): TaskInput {
    return {
        title: task.title,
        description: task.description ?? '',
        effort: task.effort,
        frequency: task.frequency,
        startingDate: task.startingDate,
        alwaysSameDay: task.alwaysSameDay,
        strategy: task.strategy,
        responsibleMemberId: task.responsibleMemberId,
    };
}

// Without a task the form creates a new quest, with a task it edits that quest
function QuestForm({household, task, onSaved}: { household: Household, task?: Task, onSaved: () => void }) {
    const {register, control, handleSubmit, setValue, formState: {errors, isValid, isDirty}} = useForm<TaskInput>({
        mode: 'onTouched',
        defaultValues: task ? toTaskInput(task) : emptyTaskInput(household),
    });

    const [frequency, startingDate, alwaysSameDay, effort, strategy] =
        useWatch({control, name: ['frequency', 'startingDate', 'alwaysSameDay', 'effort', 'strategy']});

    const {data: efforts, isLoading: isEffortsLoading, isError: isEffortsError} = useGetEfforts();
    const showSpinner = useDelayedLoading(isEffortsLoading);

    const effortOptions = efforts?.map(item => ({
        value: item.effort,
        label: capitalize(item.effort),
        icon: <Meter filled={EFFORT_LEVELS[item.effort]} total={3}/>,
        detail: `+${item.points}`,
    })) ?? [];

    const selectedPoints = efforts?.find(item => item.effort === effort)?.points ?? 0;
    const createTask = useCreateTask(household.id);
    const updateTask = useUpdateTask(household.id);
    const saveTask = task ? updateTask : createTask;

    const onSubmit = (data: TaskInput) => {
        if (task) {
            updateTask.mutate({taskId: task.id, ...data}, {onSuccess: () => onSaved()});
        } else {
            createTask.mutate(data, {onSuccess: () => onSaved()});
        }
    }

    if (!efforts) {
        if (isEffortsError) return <p>Something went wrong loading the quest options. Please try again.</p>;
        return showSpinner ? <Spinner/> : null;
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={task
                ? 'Save changes'
                : <>Post quest <span className='button-points'>+{selectedPoints}</span></>}
            submitDisabled={!isValid || (task && !isDirty) || saveTask.isPending}
            error={saveTask.isError
                ? `Something went wrong ${task ? 'saving' : 'posting'} your quest. Please try again.`
                : undefined}
        >
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

            <LabeledGroup label='Repeats' hint={getRepeatHint(frequency)}>
                <RepeatPicker
                    frequency={frequency}
                    startingDate={startingDate}
                    alwaysSameDay={alwaysSameDay ?? false}
                    onFrequencyChange={value => setValue('frequency', value, {shouldDirty: true})}
                    onStartingDateChange={value => setValue('startingDate', value, {shouldDirty: true})}
                    onAlwaysSameDayChange={value => setValue('alwaysSameDay', value, {shouldDirty: true})}
                />
            </LabeledGroup>

            <LabeledGroup label='Effort' hint={EFFORT_HINTS[effort]}>
                <Controller
                    name='effort'
                    control={control}
                    render={({field}) => (
                        <OptionPicker options={effortOptions} value={field.value} onChange={field.onChange}/>
                    )}
                />
            </LabeledGroup>

            <LabeledGroup label='Who does it' hint={ASSIGNMENT_HINTS[strategy]}>
                <Controller
                    name='strategy'
                    control={control}
                    render={({field}) => (
                        <SegmentedControl options={ASSIGNMENT_OPTIONS} value={field.value}
                                          onChange={field.onChange}/>
                    )}
                />
            </LabeledGroup>

            <LabeledGroup label={strategy === 'SOLO' ? 'Responsible' : 'Starts with'}>
                <Controller
                    name='responsibleMemberId'
                    control={control}
                    render={({field}) => (
                        <OptionPicker options={toMemberOptions(household.members)} value={field.value}
                                      onChange={field.onChange}/>
                    )}
                />
            </LabeledGroup>
        </Form>
    );
}

export default QuestForm;
