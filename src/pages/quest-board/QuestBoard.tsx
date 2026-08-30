import './QuestBoard.css'
import Header from "../../components/header/Header.tsx";
import Scorebar from "../../components/score-bar/Scorebar.tsx";

function QuestBoard() {
    return (
        <>
            <Header title="Quest Board">
                <Scorebar title='House score'/>
                <p>x blocks to go: GOAL</p>
            </Header>
            <main>

            </main>

            <nav>

            </nav>

        </>
    );
}

export default QuestBoard;