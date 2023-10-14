import { useNavigate } from 'react-router-dom'
import './ManagementReferation.css'

import img from '../../assets/imgs/favicons/projection-favikon.png'

const ManagementReferation = ({imgName, url, text}) => {

    const navigate = useNavigate()

    const imgBg = {
        backgroundImage: `url(${require(`../../assets/imgs/favicons/${imgName}`)})`
    }

    console.log(img);

    return (
        <div className='management-reference' onClick={() => navigate(url)}>
            <div className='management-reference-img' style={imgBg}>

            </div>
            <p>{text}</p>
        </div>
    )
}

export default ManagementReferation