import {Route, Routes} from "react-router";
import Quests from "./pages/quests/Quests.tsx";
import Board from "./pages/board/Board.tsx";
import Settings from "./pages/settings/Settings.tsx";
import Lists from "./pages/lists/Lists.tsx";
import Nav from "./components/nav/Nav.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/quests" element={<Quests/>}/>
                <Route path="/leaderboard" element={<Board/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/lists" element={<Lists/>}/>
            </Routes>
            <Nav/>
        </>
    )
}

export default App
