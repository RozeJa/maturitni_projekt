import Cinema from '../../../models/Cinema'
import './CinemaDetail.css'

export const validateCinema = (data: Cinema): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs

}

const CinemaDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Cinema, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {
    return (
        <>
        cinema detail 
        </>
    )
}

export default CinemaDetail