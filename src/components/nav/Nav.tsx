import './Nav.css'
import {CartIcon, LeaderboardIcon, QuestsIcon, SettingsIcon} from "../icons/NavIcons.tsx";
import {NavLink} from "react-router";

function navItemClassName({isActive}: { isActive: boolean }) {
    return isActive ? 'nav-item active' : 'nav-item';
}

function Nav() {
    return (
        <nav className='outer-container'>
            <ul className='nav-items'>
                <li>
                    <NavLink to="/leaderboard" className={navItemClassName}>
                        <LeaderboardIcon className='nav-icon'/>
                        Board
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/lists" className={navItemClassName}>
                        <CartIcon className='nav-icon'/>
                        Lists
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/quests" className={navItemClassName}>
                        <QuestsIcon className='nav-icon'/>
                        Quests
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings" className={navItemClassName}>
                        <SettingsIcon className='nav-icon'/>
                        Settings
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;