import { useEffect, useState } from 'react'
import logout from '../global_functions/logout'
import readTokenProperty from '../global_functions/readTokenProperty'
import verifyAccess from '../global_functions/verifyAccess'
import './MainLayout.css'
import { Outlet, useNavigate } from "react-router-dom"
import { setOnLoading } from '../global_functions/ServerAPI'
import LoadingSpinner from '../LoadingSpiner'
import { getSessionStorageItem } from '../global_functions/storagesActions'

const MainLayout = () => {

    const [hamburger, setHamburger] = useState(<></>)
    const [menuSettted, setMenuSetted] = useState(false)
    const [loadingComp, setLoadingComp] = useState(<></>)

    setInterval(() => {
        let loading = getSessionStorageItem("loading")
        
        if (loading == "true") {
            setLoadingComp(<LoadingSpinner loading={true} />)
        } else  setLoadingComp(<></>)
    }, 50)

    useEffect(() => {
        if (menuSettted) {
            setHamburger(
                <div className='nav-burger-content'>
                    {edit}
                    {auth}
                </div>)
        } else {
            setHamburger(<></>)
        }
    }, [menuSettted])


    const auth = verifyAccess() ? (
        <> 
            <a href={`/my-reservation/${readTokenProperty("sub")}`}>Můj účet</a>
            <a href='/' 
                onClick={() => {
                    logout()
                }
            }>Odhlásit se</a>
        </>
    ) : (
        <>
            <a href="/login">Přihlásit se</a>
            <a href="/register">Registrovat se</a>
        </>
    )

    const edit = verifyAccess("projection-create") ? (
        <>
            <a href='/management'>Správa</a>
        </>
    ) : (
        <>
        </>
    )

    return (
        <div onClick={() => {
            if (menuSettted)
                setMenuSetted(false)
            }
        }>
            <nav>
                { loadingComp }
                <div className='nav-logo'>
                    <a href='/'>Cinema Town</a>
                </div>
                <div className='nav-links'>
                    {edit}
                    {auth}
                </div>
                <div className='nav-burger'>
                    <div className='nav-burger-menu' onClick={() => setMenuSetted(!menuSettted)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    {hamburger}
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>

            <footer>
                <p>© Rožek Jan 2023-2024</p>
            </footer>
        </div>
    )
}

export default MainLayout