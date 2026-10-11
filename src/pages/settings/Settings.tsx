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
import {Link, useNavigate} from "react-router";
import {useLeaveHousehold} from "../../hooks/useLeaveHousehold.ts";
import Spinner from "../../components/ui/spinner/Spinner.tsx";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import {getErrorMessage} from "../../utils/error.ts";

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
    const orderedMembers = [...(household?.members ?? [])].sort((a, b) => a.role.localeCompare(b.role));

    const navigate = useNavigate();
    const leaveHousehold = useLeaveHousehold(household?.id);

    if (!me) return <p>Your profile could not be loaded. Try again.</p>

    const handleLeave = () => {
        if (!member || leaveHousehold.isPending) return;
        leaveHousehold.mutate(member.id, {onSuccess: () => navigate('/join-household')});
    }

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
                            {!householdId ? (
                                <div className='panel settings-status'>
                                    <p>You're not part of a household yet.</p>
                                    <Link to='/join-household'>Join a household</Link>
                                </div>
                            ) : isHouseholdLoading ? (
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
                                    {member?.role === 'ADMIN' &&
                                        <SettingRow
                                            title='+ Invite a housemate...'
                                        />
                                    }
                                </div>
                            )}
                        </LabeledGroup>
                        {member &&
                            <div className='settings-action'>
                                <Button
                                    variant='danger-secondary'
                                    type='button'
                                    size='large'
                                    onClick={handleLeave}
                                >
                                    {leaveHousehold.isPending ? 'Leaving...' : 'Leave house'}
                                </Button>
                                {leaveHousehold.isError &&
                                    <p className='settings-error'>
                                        {getErrorMessage(leaveHousehold.error, "Couldn't leave the household. Please try again.")}
                                    </p>
                                }
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
                        <Button
                            variant='danger'
                            type='button'
                            size='large'
                        >
                            Delete account
                        </Button>
                    </LabeledGroup>
                </section>
            </main>
            <footer className='outer-container'>
                <p>ChoreQuest v{__APP_VERSION__}</p>
            </footer>
        </div>
    );
}

export default Settings;
