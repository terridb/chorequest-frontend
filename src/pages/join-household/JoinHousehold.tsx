import './JoinHousehold.css'
import Header from "../../components/ui/header/Header.tsx";
import useCurrentUser from "../../auth/useCurrentUser.ts";
import Button from "../../components/ui/button/Button.tsx";
import Logo from "../../components/ui/logo/Logo.tsx";
import SettingRow from "../../components/ui/setting-row/SettingRow.tsx";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet.tsx";
import {useState} from "react";
import Form from "../../components/ui/form/Form.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {HouseholdMember} from "../../types/household.ts";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";
import NewHouseholdForm from "../../components/households/new-household-form/NewHouseholdForm.tsx";
import {useAuth0} from "@auth0/auth0-react";

function JoinHousehold() {
    const {logout} = useAuth0();
    const {data: me} = useCurrentUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isInviteCodeOpen, setIsInviteCodeOpen] = useState(false);
    const [isNewHouseholdOpen, setIsNewHouseholdOpen] = useState(false);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<{ code: string }>({
        mode: 'onTouched',
        defaultValues: {code: ''},
    });

    const acceptInvite = useMutation({
        mutationFn: (code: string) =>
            apiClient.post<HouseholdMember>(`/api/invites/${encodeURIComponent(code)}/accept`).then((res) => res.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["me"]});
            navigate('/quests', {replace: true});
        },
    })

    const onSubmit = ({code}: { code: string }) => {
        acceptInvite.mutate(code.trim());
    }

    const closeInviteCode = () => {
        setIsInviteCodeOpen(false);
        reset();
        acceptInvite.reset();
    }

    return (
        <div className='join-household'>
            <Header
                title={`Hey, ${me?.firstName}`}
                toolbar={
                    <>
                        <Logo/>
                        <Button
                            variant='dark'
                            type='button'
                            size='small'
                            onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
                        >
                            Log out
                        </Button>
                    </>
                }
            >
                <p>You're not in a household yet. Start one for your crew, or join one someone's already set up.</p>
            </Header>
            <main className='outer-container join-household'>
                <div className='panel inner-container'>
                    <SettingRow
                        size='large'
                        title='Create a household'
                        subtitle="You'll be the admin and get an invite code to share."/>
                    <Button variant='primary' size='large' onClick={() => setIsNewHouseholdOpen(true)}>
                        Create household
                    </Button>
                </div>
                <div className='panel inner-container'>
                    <SettingRow
                        size='large'
                        title='Join a household'
                        subtitle='Enter the invite code from someone in the house.'/>
                    <Button variant='secondary' size='large' onClick={() => setIsInviteCodeOpen(true)}>
                        Enter invite code
                    </Button>
                </div>
                <p>You can only belong to one household at a time.</p>
            </main>
            <BottomSheet
                open={isNewHouseholdOpen}
                onClose={() => setIsNewHouseholdOpen(false)}
                title='New household'
            >
                <NewHouseholdForm onCreated={() => navigate('/quests', {replace: true})}/>
            </BottomSheet>
            <BottomSheet
                open={isInviteCodeOpen}
                onClose={closeInviteCode}
                title='Enter invite code'
            >
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    submitLabel='Send code'
                    submitDisabled={acceptInvite.isPending}
                    error={acceptInvite.isError ? "That code didn't work. Check it and try again." : undefined}
                >
                    <label className='form-label'>
                        Invite code
                        <input
                            type='text'
                            placeholder='Enter shared code'
                            aria-invalid={errors.code ? true : undefined}
                            {...register('code', {
                                required: 'Invite code is required',
                                validate: value => value.trim() !== '' || 'Invite code is required',
                            })}
                        />
                        {errors.code && <span className='form-error'>{errors.code.message}</span>}
                    </label>
                </Form>
            </BottomSheet>
        </div>
    );
}

export default JoinHousehold;