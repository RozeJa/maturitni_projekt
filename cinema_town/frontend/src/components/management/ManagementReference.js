import { useNavigate } from 'react-router-dom'
import './ManagementReferation.css'
import Filter from './Filter'

const ManagementReferation = ({imgName, url, text}) => {

    const navigate = useNavigate()

    const imgBg = {
        backgroundImage: `url(${require(`../../assets/imgs/favicons/${imgName}`)})`
    }

    return (
        <div className='management-reference' onClick={() => navigate(url)}>
            <div className='management-reference-img' style={imgBg} />
            <p>{text}</p>
        </div>
    )
}

export default ManagementReferation