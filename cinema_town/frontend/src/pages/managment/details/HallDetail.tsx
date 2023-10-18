import Hall from '../../../models/Hall'
import './HallDetail.css'

export const validateHall = (data: Hall): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs

}

const HallDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Hall, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {
    return (
        <>
        hall detail
        </>
    )
}

export default HallDetail