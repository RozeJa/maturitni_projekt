import { useNavigate } from 'react-router-dom'
import './ManagementReferation.css'

const ManagementReferation = ({imgName, url, text}) => {

    const navigate = useNavigate()

    const imgBg = {
        backgroundImage: `url(${require(`../../assets/imgs/favicons/${imgName}`)})`
    }

    return (
        <div className='management-reference' onClick={() => navigate(url)}>
            <div className='management-reference-img' style={imgBg}>

            </div>
            <p>{text}</p>
        </div>
    )
}

export default ManagementReferation