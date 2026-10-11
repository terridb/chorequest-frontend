import {Outlet, Route, Routes} from "react-router";
import Quests from "./pages/quests/Quests.tsx";
import Board from "./pages/board/Board.tsx";
import Settings from "./pages/settings/Settings.tsx";
import Lists from "./pages/lists/Lists.tsx";
import Nav from "./components/ui/nav/Nav.tsx";
import RequireAuth from "./auth/RequireAuth.tsx";
import QuestDetails from "./pages/quest-details/QuestDetails.tsx";
import {features} from "./config/features.ts";
import Welcome from "./pages/welcome/Welcome.tsx";
import JoinHousehold from "./pages/join-household/JoinHousehold.tsx";
import useApiAuth from "./auth/useApiAuth.ts";
import RedirectIfSignedIn from "./auth/RedirectIfSignedIn.tsx";
import RedirectIfInHousehold from "./auth/RedirectIfInHousehold.tsx";

function App() {
    useApiAuth();

    return (
        <Routes>
            <Route path="/" element={
                                 <RedirectIfSignedIn>
                                    <Welcome/>
                                </RedirectIfSignedIn>
                            }/>
            <Route element={
                        <RequireAuth>
                           <Outlet/>
                       </RequireAuth>
                   }>
                <Route element={
                            <div className='with-nav'>
                               <Outlet/>
                               <Nav/>
                           </div>
                       }>
                    <Route path="/quests" element={<Quests/>}/>
                    <Route path="/quests/:id" element={<QuestDetails/>}/>
                    {features.ranking && <Route path="/leaderboard" element={<Board/>}/>}
                    <Route path="/settings" element={<Settings/>}/>
                    {features.shoppingLists && <Route path="/lists" element={<Lists/>}/>}
                </Route>
                <Route path="/join-household" element={
                                                   <RedirectIfInHousehold>
                                                      <JoinHousehold/>
                                                  </RedirectIfInHousehold>
                                              }/>
            </Route>
        </Routes>
    )
}

export default App
