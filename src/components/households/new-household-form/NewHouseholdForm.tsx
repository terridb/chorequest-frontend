import {Controller, useForm, useWatch} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Form from "../../ui/form/Form.tsx";
import LabeledGroup from "../../ui/labeled-group/LabeledGroup.tsx";
import SegmentedControl from "../../ui/segmented-control/SegmentedControl.tsx";
import {apiClient} from "../../../api/client.ts";
import type {Household, HouseholdInput} from "../../../types/household.ts";
import type {HouseholdType} from "../../../types/enums.ts";

type NewHouseholdInput = Omit<HouseholdInput, 'photo'>;

const TYPE_OPTIONS = [
    {value: 'FAMILY', label: 'Family', hint: 'Parents, kids, the whole crew.'},
    {value: 'COUPLE', label: 'Couple', hint: 'Two people, one home.'},
    {value: 'SHARED', label: 'Shared', hint: 'Roommates splitting the place.'},
] as const satisfies readonly { value: HouseholdType, label: string, hint: string }[];

function NewHouseholdForm({onCreated}: { onCreated: () => void }) {
    const queryClient = useQueryClient();

    const {register, control, handleSubmit, formState: {errors, isValid}} = useForm<NewHouseholdInput>({
        mode: 'onTouched',
        defaultValues: {
            name: '',
            type: 'FAMILY',
            city: '',
            zipcode: '',
        },
    });

    const type = useWatch({control, name: 'type'});

    const createHousehold = useMutation({
        mutationFn: (input: NewHouseholdInput) =>
            apiClient.post<Household>('/api/households', input).then(res => res.data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["me"]}),
    });

    const onSubmit = (data: NewHouseholdInput) => {
        createHousehold.mutate({
            name: data.name.trim(),
            type: data.type,
            city: data.city?.trim() || undefined,
            zipcode: data.zipcode?.trim() || undefined,
        }, {
            onSuccess: () => onCreated(),
        });
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            submitLabel='Create household'
            submitDisabled={!isValid || createHousehold.isPending}
            error={createHousehold.isError ? 'Something went wrong creating your household. Please try again' : undefined}
        >
            <label className='form-label'>
                Household name
                <input
                    type='text'
                    placeholder='What do you call your place?'
                    aria-invalid={errors.name ? true : undefined}
                    {...register('name', {
                        required: 'Name is required',
                        validate: value => value.trim() !== '' || 'Name is required',
                        maxLength: {value: 50, message: 'Name must be at most 50 characters'},
                    })}
                />
                {errors.name && <span className='form-error'>{errors.name.message}</span>}
            </label>

            <LabeledGroup label='Type' hint={TYPE_OPTIONS.find(option => option.value === type)?.hint}>
                <Controller
                    name='type'
                    control={control}
                    render={({field}) => (
                        <SegmentedControl options={TYPE_OPTIONS} value={field.value} onChange={field.onChange}/>
                    )}
                />
            </LabeledGroup>

            <label className='form-label'>
                City
                <input
                    type='text'
                    placeholder='Optional'
                    aria-invalid={errors.city ? true : undefined}
                    {...register('city', {
                        maxLength: {value: 85, message: 'City must be at most 85 characters'},
                    })}
                />
                {errors.city && <span className='form-error'>{errors.city.message}</span>}
            </label>
            <label className='form-label'>
                Zipcode
                <input
                    type='text'
                    placeholder='Optional'
                    aria-invalid={errors.zipcode ? true : undefined}
                    {...register('zipcode', {
                        maxLength: {value: 10, message: 'Zipcode must be at most 10 characters'},
                    })}
                />
                {errors.zipcode && <span className='form-error'>{errors.zipcode.message}</span>}
            </label>
        </Form>
    );
}

export default NewHouseholdForm;
