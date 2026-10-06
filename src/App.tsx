import {Route, Routes} from "react-router";
import Quests from "./pages/quests/Quests.tsx";
import Board from "./pages/board/Board.tsx";
import Settings from "./pages/settings/Settings.tsx";
import Lists from "./pages/lists/Lists.tsx";
import Nav from "./components/ui/nav/Nav.tsx";
import RequireAuth from "./auth/RequireAuth.tsx";
import QuestDetails from "./pages/quest-details/QuestDetails.tsx";

function App() {

    return (
        <RequireAuth>
            <Routes>
                <Route path="/quests" element={<Quests/>}/>
                <Route path="/quests/:id" element={<QuestDetails/>}/>
                <Route path="/leaderboard" element={<Board/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/lists" element={<Lists/>}/>
            </Routes>
            <Nav/>
        </RequireAuth>
    )
}

export default App
