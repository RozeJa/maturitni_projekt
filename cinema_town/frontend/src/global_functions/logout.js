import { Navigate } from "react-router-dom"

const logout = () => {

    sessionStorage.removeItem('loginToken')
    localStorage.removeItem('deviceID')

    return (
        <Navigate to="/"></Navigate>
    )
}

export default logout