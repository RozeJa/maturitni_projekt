import { Navigate } from "react-router-dom"

const logout = () => {

    sessionStorage.removeItem('loginToken')

    return (
        <Navigate to=""></Navigate>
    )
}

export default logout