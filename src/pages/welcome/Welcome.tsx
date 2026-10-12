import './Welcome.css'
import Button from "../../components/ui/button/Button.tsx";
import Logo from "../../components/ui/logo/Logo.tsx";
import QuestCard from "../../components/quests/quest-card/QuestCard.tsx";
import type {TaskAssignment} from "../../types/task.ts";
import {toLocalDateString} from "../../utils/date.ts";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router";

const today = toLocalDateString(new Date());

const exampleQuest: TaskAssignment = {
    id: 'example-assignment',
    task: {
        id: 'example-task',
        title: 'Take out the trash',
        description: '',
        effort: 'SMALL',
        frequency: 'WEEKLY',
        startingDate: today,
        alwaysSameDay: false,
        defaultPoints: 10,
        strategy: 'ROTATING',
        responsibleMemberId: 'example-member',
        householdId: 'example-household',
    },
    user: {
        id: 'example-user',
        firstName: 'Jordan',
        avatarUrl: '',
    },
    dueDate: today,
};

function Welcome() {
    const {loginWithRedirect} = useAuth0();

    const handleLogin = () => loginWithRedirect({
        appState: {returnTo: '/'}
    });

    const handleSignup = () => loginWithRedirect({
        authorizationParams: {screen_hint: 'signup'}
    })

    return (
        <div className='welcome'>
            <header className='outer-container header-welcome'>
                <div className='inner-container'>
                    <Logo/>
                </div>
            </header>
            <main className='outer-container welcome-main'>
                <div className='welcome-content'>
                    <div className='welcome-illustrations'>
                        <QuestCard item={exampleQuest} memberId={undefined} preview/>
                    </div>
                    <h1>Your chores are now quests</h1>
                    <p className='welcome-description'>Your household posts the tasks, everyone clears them for points
                        and the board keeps score. Hit a
                        house goal together and claim the reward!</p>
                </div>
                <div className='button-wrapper'>
                    <Button variant='primary' size='large' onClick={handleSignup}>
                        Sign up
                    </Button>
                    <Button variant='dark' size='large' onClick={handleLogin}>
                        Log in
                    </Button>
                    <p>Got an invite code? Sign up to enter.</p>
                    <p><Link to='/privacy' className='welcome-privacy'>Privacy</Link></p>
                </div>
            </main>
        </div>

    );
}

export default Welcome;