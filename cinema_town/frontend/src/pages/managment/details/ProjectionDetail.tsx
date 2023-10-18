import Projection from '../../../models/Projection'
import './ProjectionDetail.css'

export const validateProjection = (data: Projection): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs

}

const ProjectionDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Projection, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {
    return (
        <>
        projection detail
        </>
    )
}

export default ProjectionDetail