import './AddQuestForm.css'
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {Task, TaskInput} from "../../types/task.ts";
import {ASSIGNMENT_STRATEGIES, EFFORTS, FREQUENCIES} from "../../types/enums.ts";
import type {Frequency} from "../../types/enums.ts";
import type {HouseholdMember} from "../../types/household.ts";
import {formatFrequency} from "../../utils/frequency.ts";
import {formatEffort} from "../../utils/effort.ts";
import Button from "../button/Button.tsx";
import Select from "../select/Select.tsx";

const FREQUENCIES_WITHOUT_SAME_DAY: Frequency[] = ['AS_NEEDED', 'ONCE', 'DAILY', 'EVERY_OTHER_DAY', 'EVERY_THREE_DAYS', 'EVERY_FOUR_DAYS'];

function AddQuestForm({householdId, members, onSuccess}: {
    householdId: string,
    members: HouseholdMember[],
    onSuccess: () => void,
}) {
    const {register, control, handleSubmit, watch, setValue, reset, formState: {errors}} = useForm<TaskInput>({
        defaultValues: {
            title: '',
            description: '',
            effort: 'NONE',
            frequency: 'DAILY',
            startingDate: new Date().toISOString().slice(0, 10),
            alwaysSameDay: false,
            strategy: 'SOLO',
            responsibleMemberId: '',
        }
    });

    const strategy = watch('strategy');
    const frequency = watch('frequency');
    const showAlwaysSameDay = !FREQUENCIES_WITHOUT_SAME_DAY.includes(frequency);

    useEffect(() => {
        if (strategy !== 'SOLO') setValue('responsibleMemberId', '');
    }, [strategy, setValue]);

    useEffect(() => {
        if (!showAlwaysSameDay) setValue('alwaysSameDay', false);
    }, [showAlwaysSameDay, setValue]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: TaskInput) =>
            apiClient.post<Task>(`/api/households/${householdId}/tasks`, data).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["assignments", householdId]});
            reset();
            onSuccess();
        },
    });

    const onSubmit = (data: TaskInput) => {
        mutation.mutate({
            ...data,
            responsibleMemberId: data.responsibleMemberId || undefined,
        });
    }

    return (
        <form className='add-quest-form' onSubmit={handleSubmit(onSubmit)}>
            <h2>Add a quest</h2>

            <div className='field'>
                <label htmlFor='title'>Title</label>
                <input
                    id='title'
                    type='text'
                    {...register('title', {
                        required: 'Title is required',
                        minLength: {value: 2, message: 'Title must be at least 2 characters'},
                        maxLength: {value: 100, message: 'Title must be at most 100 characters'},
                    })}
                />
                {errors.title && <span className='field-error'>{errors.title.message}</span>}
            </div>

            <div className='field'>
                <label htmlFor='description'>Description</label>
                <textarea
                    id='description'
                    {...register('description', {
                        maxLength: {value: 500, message: 'Description must be at most 500 characters'},
                    })}
                />
                {errors.description && <span className='field-error'>{errors.description.message}</span>}
            </div>

            <div className='field'>
                <label htmlFor='effort'>Effort</label>
                <Controller
                    name='effort'
                    control={control}
                    render={({field}) => (
                        <Select
                            id='effort'
                            value={field.value}
                            onChange={field.onChange}
                            options={EFFORTS.map(effort => ({value: effort, label: formatEffort(effort)}))}
                        />
                    )}
                />
            </div>

            <div className='field'>
                <label htmlFor='frequency'>Frequency</label>
                <Controller
                    name='frequency'
                    control={control}
                    render={({field}) => (
                        <Select
                            id='frequency'
                            value={field.value}
                            onChange={field.onChange}
                            options={FREQUENCIES.map(frequency => ({value: frequency, label: formatFrequency(frequency)}))}
                        />
                    )}
                />
            </div>

            {showAlwaysSameDay &&
                <div className='field field-checkbox'>
                    <label htmlFor='alwaysSameDay'>
                        <input id='alwaysSameDay' type='checkbox' {...register('alwaysSameDay')}/>
                        Always on the same day
                    </label>
                </div>
            }

            <div className='field'>
                <label htmlFor='startingDate'>Starting date</label>
                <input
                    id='startingDate'
                    type='date'
                    {...register('startingDate', {required: 'Starting date is required'})}
                />
                {errors.startingDate && <span className='field-error'>{errors.startingDate.message}</span>}
            </div>

            <div className='field'>
                <label htmlFor='strategy'>Assignment</label>
                <Controller
                    name='strategy'
                    control={control}
                    render={({field}) => (
                        <Select
                            id='strategy'
                            value={field.value}
                            onChange={field.onChange}
                            options={ASSIGNMENT_STRATEGIES.map(option => ({value: option, label: option === 'SOLO' ? 'Solo' : 'Rotating'}))}
                        />
                    )}
                />
            </div>

            <div className='field'>
                <label htmlFor='responsibleMemberId'>Responsible</label>
                <Controller
                    name='responsibleMemberId'
                    control={control}
                    rules={{
                        validate: value => strategy !== 'SOLO' || !!value || 'A responsible member is required for solo quests',
                    }}
                    render={({field}) => (
                        <Select
                            id='responsibleMemberId'
                            disabled={strategy !== 'SOLO'}
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            options={[
                                {value: '', label: 'Unassigned'},
                                ...members.map(member => ({value: member.id, label: member.user.firstName})),
                            ]}
                        />
                    )}
                />
                {errors.responsibleMemberId && <span className='field-error'>{errors.responsibleMemberId.message}</span>}
            </div>

            {mutation.isError && Object.keys(errors).length === 0 &&
                <p className='form-error'>Something went wrong. Please try again.</p>}

            <Button type='submit' className='submit-button' disabled={mutation.isPending}>
                {mutation.isPending ? 'Adding...' : 'Add quest'}
            </Button>
        </form>
    );
}

export default AddQuestForm;
