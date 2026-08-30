import {Route, Routes} from "react-router";
import QuestBoard from "./pages/quest-board/QuestBoard.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<QuestBoard/>}/>
            </Routes>
        </>
    )
}

export default App
