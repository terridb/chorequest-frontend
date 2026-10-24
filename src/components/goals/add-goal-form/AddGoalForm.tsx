import './AddGoalForm.css'
import type {GoalRequest} from "../../../types/goal.ts";
import Form from "../../ui/form/Form.tsx";
import {Controller, useForm, useWatch} from "react-hook-form";
import LabeledGroup from "../../ui/labeled-group/LabeledGroup.tsx";
import type {Household} from "../../../types/household.ts";
import {useCreateGoal} from "../../../hooks/goals/useCreateGoal.ts";
import OptionPicker from "../../ui/option-picker/OptionPicker.tsx";
import Meter from "../../ui/meter/Meter.tsx";
import {useState} from "react";

const POINT_PRESETS = [
    {points: 250, label: 'Warm-up'},
    {points: 500, label: 'Steady'},
    {points: 1000, label: 'Push'},
    {points: 2000, label: 'Epic'},
];

const POINT_OPTIONS = POINT_PRESETS.map((preset, i) => ({
    value: preset.points,
    label: preset.label,
    icon: <Meter filled={i + 1} total={POINT_PRESETS.length}/>,
    detail: String(preset.points),
}));

function getPointsHint(points: number): string {
    return `Around ${Math.ceil(points / 15)} quests`;
}

function AddGoalForm({household, onCreated}: { household: Household, onCreated: () => void }) {
    const {register, control, handleSubmit, formState: {errors, isValid}} = useForm<GoalRequest>({
        mode: 'onTouched',
        defaultValues: {
            title: '',
            description: '',
            goalPoints: POINT_PRESETS[0].points
        }
    });

    const goalPoints = useWatch({control, name: 'goalPoints'});
    const [customPoints, setCustomPoints] = useState('');

    const createGoal = useCreateGoal(household.id);

    const onSubmit = (data: GoalRequest) => {
        createGoal.mutate(data, {
            onSuccess: () => onCreated(),
        });
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={<>Set goal <span className='button-points'>- {goalPoints} pts</span> </>}
            submitDisabled={!isValid}
            error={createGoal.isError ? 'Something went wrong posting your goal. Please try again' : undefined}
        >
            <label className='form-label'>
                Title
                <input
                    type='text'
                    placeholder='What are we working toward?'
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

            <LabeledGroup label='Goal points' hint={getPointsHint(goalPoints)}>
                <Controller
                    name='goalPoints'
                    control={control}
                    rules={{validate: value => Number.isInteger(value) && value > 0 || 'Enter a whole number above 0'}}
                    render={({field}) => (
                        <>
                            <OptionPicker
                                options={POINT_OPTIONS}
                                value={field.value}
                                onChange={value => {
                                    setCustomPoints('');
                                    field.onChange(value);
                                }}
                            />
                            <label className='goal-points-input'>
                                <span>Or exactly</span>
                                <input
                                    type='number'
                                    value={customPoints}
                                    onChange={e => {
                                        setCustomPoints(e.target.value);
                                        field.onChange(e.target.valueAsNumber);
                                    }}
                                    onBlur={field.onBlur}
                                />
                                <span className='goal-points-unit'>pts</span>
                            </label>
                        </>
                    )}
                />
                {errors.goalPoints && <span className='form-error'>{errors.goalPoints.message}</span>}
            </LabeledGroup>
        </Form>
    );
}

export default AddGoalForm;