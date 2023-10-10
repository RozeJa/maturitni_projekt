import logout from '../global_functions/logout'
import readTokenProperty from '../global_functions/readTokenProperty'
import verifyAccess from '../global_functions/verifyAccess'
import './MainLayout.css'
import { Outlet } from "react-router-dom"

const MainLayout = () => {

    const auth = verifyAccess() ? (
        <div>
            <a href={`/my-reservation/${readTokenProperty("sub")}`}>Moje rezervace: {readTokenProperty("email")}</a>
            <a href='' 
                onClick={() => {
                    logout()
                }
            }>Odhlásit se</a>
        </div>
    ) : (
        <div>
            <a href="/login">Přihlásit se</a>
            <a href="/register">Registrovat se</a>
        </div>
    )

    const edit = verifyAccess("film-update") ? (
        <div>
            <a href='/management'>Správa</a>
        </div>
    ) : (
        <>
        </>
    )

    return (
        <>
            <nav>
                <div className='nav-logo'>
                    <a href='/'>Logo as home btn</a>
                </div>
                <div className='nav-links'>
                    {auth}
                    {edit}
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>

            <footer>
                <p>© Rožek Jan 2023-2024</p>
            </footer>
        </>
    )
}

export default MainLayout