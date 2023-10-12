const logout = () => {

    sessionStorage.removeItem('loginToken')
}

export default logout