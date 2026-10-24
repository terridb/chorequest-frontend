import './EditProfileForm.css'
import {type ChangeEvent, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useAuth0} from "@auth0/auth0-react";
import type {User, UserInput} from "../../../types/user.ts";
import Form from "../../ui/form/Form.tsx";
import Button from "../../ui/button/Button.tsx";
import Avatar from "../../ui/avatar/Avatar.tsx";
import {useUpdateProfile} from "../../../hooks/account/useUpdateProfile.ts";
import {useUploadAvatar} from "../../../hooks/account/useUploadAvatar.ts";
import {useDeleteAvatar} from "../../../hooks/account/useDeleteAvatar.ts";
import {getErrorMessage} from "../../../utils/error.ts";
import {hasCustomAvatar} from "../../../utils/avatar.ts";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_TYPES = ['image/jpeg', 'image/png'];

const nameRules = (label: string, required: boolean) => ({
    validate: (value: string) => !required || value.trim() !== '' || `${label} is required`,
    maxLength: {value: 50, message: `${label} must be at most 50 characters`},
});

function EditProfileForm({user, avatarSeed, onSaved}: { user: User, avatarSeed: string, onSaved: () => void }) {
    const {user: authUser} = useAuth0();
    const {register, handleSubmit, formState: {errors, isValid, isDirty}} = useForm<UserInput>({
        mode: 'onTouched',
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName ?? '',
        }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState<File | null>();
    const [avatarPreview, setAvatarPreview] = useState<string>();
    const [avatarError, setAvatarError] = useState<string>();

    const updateProfile = useUpdateProfile(user.id);
    const uploadAvatar = useUploadAvatar(user.id);
    const deleteAvatar = useDeleteAvatar(user.id);

    const isPending = updateProfile.isPending || uploadAvatar.isPending || deleteAvatar.isPending;
    const failedRequest = [updateProfile, uploadAvatar, deleteAvatar].find(mutation => mutation.isError);
    const showsCustomAvatar = avatar ? true : avatar === null ? false : hasCustomAvatar(user.avatarUrl);
    const shownAvatarUrl = avatarPreview ?? (avatar === null ? authUser?.picture : user.avatarUrl);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (!AVATAR_TYPES.includes(file.type)) {
            setAvatarError('Choose a JPEG or PNG image');
            return;
        }
        if (file.size > MAX_AVATAR_BYTES) {
            setAvatarError('Choose an image of 5 MB or less');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(file);
            setAvatarPreview(reader.result as string);
            setAvatarError(undefined);
        };
        reader.readAsDataURL(file);
    }

    const handleRemovePhoto = () => {
        setAvatar(null);
        setAvatarPreview(undefined);
        setAvatarError(undefined);
    }

    const saveAvatar = () => {
        if (avatar) uploadAvatar.mutate(avatar, {onSuccess: onSaved});
        else if (avatar === null) deleteAvatar.mutate(undefined, {onSuccess: onSaved});
        else onSaved();
    }

    const onSubmit = (data: UserInput) => {
        if (isPending) return;
        [updateProfile, uploadAvatar, deleteAvatar].forEach(mutation => mutation.reset());

        if (!isDirty) return saveAvatar();
        updateProfile.mutate(
            {firstName: data.firstName.trim(), lastName: data.lastName.trim()},
            {onSuccess: saveAvatar},
        );
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={isPending ? 'Saving...' : 'Save changes'}
            submitDisabled={!isValid || (!isDirty && avatar === undefined) || isPending}
            error={failedRequest
                ? getErrorMessage(failedRequest.error, "Couldn't save your profile. Please try again.")
                : undefined}
        >
            <div className='edit-profile-photo'>
                <button
                    type='button'
                    className='edit-profile-photo-trigger'
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Avatar key={shownAvatarUrl} src={shownAvatarUrl} name={user.firstName} seed={avatarSeed}/>
                </button>
                <div className='edit-profile-photo-actions'>
                    <Button
                        variant='ghost'
                        type='button'
                        className='edit-profile-photo-link'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {showsCustomAvatar ? 'Change photo' : 'Add photo'}
                    </Button>
                    {showsCustomAvatar &&
                        <Button
                            variant='ghost'
                            type='button'
                            onClick={handleRemovePhoto}
                        >
                            Remove
                        </Button>
                    }
                </div>
                <input
                    ref={fileInputRef}
                    type='file'
                    accept={AVATAR_TYPES.join(',')}
                    hidden
                    onChange={handleFileChange}
                />
                {avatarError && <span className='form-error'>{avatarError}</span>}
            </div>
            <label className='form-label'>
                First name
                <input
                    type='text'
                    autoComplete='given-name'
                    aria-invalid={errors.firstName ? true : undefined}
                    {...register('firstName', nameRules('First name', true))}
                />
                {errors.firstName && <span className='form-error'>{errors.firstName.message}</span>}
            </label>
            <label className='form-label'>
                Last name
                <input
                    type='text'
                    autoComplete='family-name'
                    aria-invalid={errors.lastName ? true : undefined}
                    {...register('lastName', nameRules('Last name', false))}
                />
                {errors.lastName && <span className='form-error'>{errors.lastName.message}</span>}
            </label>
        </Form>
    );
}

export default EditProfileForm;
