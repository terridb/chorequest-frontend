import './Privacy.css'
import {useNavigate} from "react-router";
import Header from "../../components/ui/header/Header.tsx";
import LabeledGroup from "../../components/ui/labeled-group/LabeledGroup.tsx";

function Privacy() {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.state?.idx > 0) navigate(-1);
        else navigate('/');
    }

    return (
        <div className='privacy-page'>
            <Header
                title='Privacy'
                toolbar={
                    <button type='button' className='header-back privacy-back' onClick={handleBack}>
                        {'<'} Back
                    </button>
                }
            >
                <p>Last updated October 2026</p>
            </Header>
            <main className='outer-container'>
                <section className='inner-container privacy'>
                    <p className='privacy-intro'>
                        ChoreQuest is a small app for sharing chores with the people you live with. This page explains
                        what it stores about you and what you can do about it.
                    </p>
                    <LabeledGroup label='What is stored'>
                        <div className='panel'>
                            <p><strong>Your profile:</strong> your first name, last name and profile picture, taken
                                from your login.</p>
                            <p><strong>Your login:</strong> your email address and password or social login. These are
                                stored by Auth0, which handles signing in. ChoreQuest never sees your password.</p>
                            <p><strong>Your household:</strong> its name, type, city, postcode and time zone, who is in
                                it, and the quests, points, goals and invite codes you create together.</p>
                        </div>
                    </LabeledGroup>
                    <LabeledGroup label='Where it is stored'>
                        <div className='panel'>
                            <p>Your data is stored in the EU: logins with Auth0, and everything else in a database at
                                Neon and on a server at Render, both in Frankfurt.</p>
                            <p>Your browser keeps your login session on your device, so you stay signed in. There are
                                no tracking cookies, analytics or ads.</p>
                            <p>The servers keep short-lived technical logs, such as IP addresses, to keep the app
                                running and secure.</p>
                        </div>
                    </LabeledGroup>
                    <LabeledGroup label='Who can see it'>
                        <div className='panel'>
                            <p>People in your household see your first name, profile picture, points and the quests
                                you do. Nobody else using ChoreQuest can see your household.</p>
                            <p>Your data is never sold or shared, and is only used to run ChoreQuest.</p>
                        </div>
                    </LabeledGroup>
                    <LabeledGroup label='Your choices'>
                        <div className='panel'>
                            <p><strong>Leave your household</strong> in Settings. Your points and the quests you
                                completed stay with that household.</p>
                            <p><strong>Delete your account</strong> in Settings. This deletes your profile and your
                                login straight away. Quests you completed stay in your household's history, but are no
                                longer linked to you.</p>
                        </div>
                    </LabeledGroup>
                    <LabeledGroup label='Contact'>
                        <div className='panel'>
                            <p>Questions about your data, or want a copy of it? Email <a
                                href='mailto:chorequest@proton.me'>chorequest@proton.me</a>.</p>
                        </div>
                    </LabeledGroup>
                </section>
            </main>
        </div>
    );
}

export default Privacy;
