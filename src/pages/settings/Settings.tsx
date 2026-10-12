import {useAuth0} from "@auth0/auth0-react";
import Header from "../../components/ui/header/Header.tsx";
import useCurrentUser from "../../auth/useCurrentUser.ts";
import {useGetHousehold} from "../../hooks/useGetHousehold.ts";
import Button from "../../components/ui/button/Button.tsx";
import LabeledGroup from "../../components/ui/labeled-group/LabeledGroup.tsx";
import SettingRow from "../../components/ui/setting-row/SettingRow.tsx";
import {capitalize} from "../../utils/text.ts";
import Avatar from "../../components/ui/avatar/Avatar.tsx";
import './Settings.css'
import {features} from "../../config/features.ts";
import {Link, Navigate, useNavigate} from "react-router";
import {useLeaveHousehold} from "../../hooks/useLeaveHousehold.ts";
import Spinner from "../../components/ui/spinner/Spinner.tsx";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import {getErrorMessage} from "../../utils/error.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {HouseholdInvite} from "../../types/invite.ts";
import {formatDayAndMonth} from "../../utils/date.ts";
import {useState} from "react";
import {CrossIcon} from "../../components/ui/icons/NavIcons.tsx";
import ConfirmSheet from "../../components/ui/confirm-sheet/ConfirmSheet.tsx";
import {useDeleteAccount} from "../../hooks/useDeleteAccount.ts";

type ConfirmAction = 'invite' | 'leave' | 'account';

function Settings() {
    const {logout} = useAuth0();

    const {data: me} = useCurrentUser();
    const householdId = me?.householdIds[0];
    const {
        data: household,
        isLoading: isHouseholdLoading,
        isError: isHouseholdError,
        refetch: refetchHousehold,
    } = useGetHousehold(householdId);

    const showSpinner = useDelayedLoading(isHouseholdLoading);
    const member = household?.members.find(member => member.user.id === me?.id);
    const householdDetails = household
        ? [capitalize(household.type), [household.city, household.zipcode].filter(Boolean).join(' ')].filter(Boolean).join(' · ')
        : '';
    const orderedMembers = [...(household?.members ?? [])].sort((a, b) => a.role.localeCompare(b.role));

    const navigate = useNavigate();
    const leaveHousehold = useLeaveHousehold(household?.id);
    const deleteAccount = useDeleteAccount();
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

    const isAdmin = member?.role === 'ADMIN';

    const {data: currentInvite} = useQuery({
        queryKey: ["invite", householdId],
        queryFn: () =>
            apiClient.get<HouseholdInvite | "">(`/api/households/${householdId}/invites/current`)
                .then(res => res.data || null),
        enabled: !!householdId && isAdmin,
    });

    const [isCodeCopied, setIsCodeCopied] = useState(false);

    const queryClient = useQueryClient();
    const createInvite = useMutation({
        mutationFn: (householdId: string) =>
            apiClient.post<HouseholdInvite>(`/api/households/${householdId}/invites`).then(res => res.data),
        onSuccess: (invite, householdId) => queryClient.setQueryData(["invite", householdId], invite),
    })
    const deleteInvite = useMutation({
        mutationFn: (invite: HouseholdInvite) =>
            apiClient.delete(`/api/households/${householdId}/invites/${invite.id}`),
        onSuccess: () => queryClient.setQueryData(["invite", householdId], null),
    })

    if (!me) return <p>Your profile could not be loaded. Try again.</p>
    if (!householdId) return <Navigate to='/join-household' replace/>;

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCodeCopied(true);
            setTimeout(() => setIsCodeCopied(false), 2000);
        });
    }

    const handleLeave = () => {
        if (!member || leaveHousehold.isPending) return;
        leaveHousehold.mutate(member.id, {onSuccess: () => navigate('/join-household')});
    }

    const handleDeleteInvite = () => {
        if (!currentInvite || deleteInvite.isPending) return;
        deleteInvite.mutate(currentInvite, {onSuccess: () => setConfirmAction(null)});
    }

    const handleDeleteAccount = () => {
        if (deleteAccount.isPending) return;
        deleteAccount.mutate(
            {userId: me.id, memberId: member?.id},
            {onSuccess: () => logout({logoutParams: {returnTo: window.location.origin}})},
        );
    }

    const handleCloseConfirm = () => {
        setConfirmAction(null);
        deleteInvite.reset();
        leaveHousehold.reset();
        deleteAccount.reset();
    }

    const householdName = household?.name ?? 'your house';

    return (
        <div>
            <Header
                title={me.firstName}
                toolbar={
                    <>
                        <span></span>
                        {features.editProfile &&
                            <Button
                                variant='dark'
                                size='small'
                            >
                                Edit profile
                            </Button>
                        }
                    </>
                }
                aside={member && <p className='points'>{member.points} PTS</p>}
            >
            </Header>
            <main className='outer-container'>
                <section className='inner-container'>
                    <div className='settings-wrapper'>
                        <LabeledGroup label='household'>
                            {isHouseholdLoading ? (
                                <div className='panel settings-status'>
                                    {showSpinner && <Spinner/>}
                                </div>
                            ) : isHouseholdError || !household ? (
                                <div className='panel settings-status'>
                                    <p>Something went wrong loading your household.</p>
                                    <Button
                                        variant='secondary'
                                        type='button'
                                        size='small'
                                        onClick={() => refetchHousehold()}
                                    >
                                        Try again
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className='panel'>
                                        <SettingRow size='large' title={household.name} subtitle={householdDetails}/>
                                    </div>
                                    <div className='panel'>
                                        {orderedMembers.map((member) => (
                                            <SettingRow
                                                key={member.id}
                                                title={member.user.firstName}
                                                icon={<Avatar src={member.user.avatarUrl} name={member.user.firstName}
                                                              seed={member.id}/>}
                                                subtitle={`${member.user.id === me.id ? 'You - ' : ''}${member.points} pts`}
                                            >
                                                <p className={`role-badge${member.role === 'ADMIN' ? ' role-badge--admin' : ''}`}>{capitalize(member.role)}</p>
                                            </SettingRow>
                                        ))
                                        }
                                        {isAdmin &&
                                            <SettingRow
                                                title='Invite a housemate'
                                                subtitle={createInvite.isError
                                                    ? getErrorMessage(createInvite.error, "Couldn't create an invite. Please try again.")
                                                    : 'Get a code to share with them'}
                                            >
                                                <Button
                                                    variant='secondary'
                                                    type='button'
                                                    size='small'
                                                    disabled={createInvite.isPending}
                                                    onClick={() => createInvite.mutate(household.id)}
                                                >
                                                    {createInvite.isPending ? 'Creating...' : 'Invite'}
                                                </Button>
                                            </SettingRow>
                                        }
                                    </div>
                                </>
                            )}
                        </LabeledGroup>
                        {isAdmin && currentInvite &&
                            <LabeledGroup label='Open invite'>
                                <div className='panel'>
                                    <SettingRow
                                        title={currentInvite.code}
                                        subtitle={`Expires ${formatDayAndMonth(new Date(currentInvite.expiresAt))}`}
                                    >
                                        <div className='invite-actions'>
                                            <Button
                                                variant='secondary'
                                                type='button'
                                                size='small'
                                                onClick={() => handleCopyCode(currentInvite.code)}
                                            >
                                                {isCodeCopied ? 'Copied!' : 'Copy'}
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                type='button'
                                                size='small'
                                                onClick={() => setConfirmAction('invite')}
                                            >
                                                <CrossIcon className='button-icon'/>
                                            </Button>
                                        </div>
                                    </SettingRow>
                                </div>
                            </LabeledGroup>
                        }
                        {member &&
                            <div className='settings-action'>
                                <Button
                                    variant='danger-secondary'
                                    type='button'
                                    size='large'
                                    onClick={() => setConfirmAction('leave')}
                                >
                                    Leave house
                                </Button>
                            </div>
                        }
                    </div>
                    <LabeledGroup label='Account'>
                        <Button
                            variant='primary'
                            type='button'
                            size='large'
                            onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
                        >
                            Log out
                        </Button>
                        {features.deleteAccount &&
                            <Button
                                variant='danger'
                                type='button'
                                size='large'
                                onClick={() => setConfirmAction('account')}
                            >
                                Delete account
                            </Button>
                        }
                    </LabeledGroup>
                </section>
            </main>
            <ConfirmSheet
                open={confirmAction === 'invite'}
                onClose={handleCloseConfirm}
                title='Delete invite'
                message="The code stops working straight away, so nobody can use it to join anymore."
                confirmLabel='Delete invite'
                pendingLabel='Deleting...'
                onConfirm={handleDeleteInvite}
                isPending={deleteInvite.isPending}
                error={deleteInvite.isError
                    ? getErrorMessage(deleteInvite.error, "Couldn't delete the invite. Please try again.")
                    : undefined}
            />
            <ConfirmSheet
                open={confirmAction === 'leave'}
                onClose={handleCloseConfirm}
                title='Leave house'
                message={`Your points stay in ${householdName} and your quests are passed on to your housemates. You'll need a new invite to join again.`}
                confirmLabel='Leave house'
                pendingLabel='Leaving...'
                onConfirm={handleLeave}
                isPending={leaveHousehold.isPending}
                error={leaveHousehold.isError
                    ? getErrorMessage(leaveHousehold.error, "Couldn't leave the household. Please try again.")
                    : undefined}
            />
            <ConfirmSheet
                open={confirmAction === 'account'}
                onClose={handleCloseConfirm}
                title='Delete account'
                message={`You'll leave ${householdName} and your profile and login will be deleted. This can't be undone.`}
                confirmLabel='Delete account'
                pendingLabel='Deleting...'
                onConfirm={handleDeleteAccount}
                isPending={deleteAccount.isPending}
                error={deleteAccount.isError
                    ? getErrorMessage(deleteAccount.error, "Couldn't delete your account. Please try again.")
                    : undefined}
            />
            <footer className='outer-container settings-footer'>
                <p>ChoreQuest v{__APP_VERSION__} · <Link to='/privacy'>Privacy</Link></p>
            </footer>
        </div>
    );
}

export default Settings;
