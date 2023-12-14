import './GenreDetail.css'
import Genre, { defaultGerne } from '../../../models/Genre'
import SmartInput from '../../../components/SmartInput'
import { useEffect, useState } from 'react'
import { storeDetailData } from './Detail'

export const validateGenre = (data: Genre): Array<string> => {
    let errs: Array<string> = []

    if (data.name === '') {
        errs.push('Abyste mohly úspěšně odeslat formulář musíte vyplnit název žánru.')
    }

    return errs
}

const GenreDetail = ({
    data, 
    setErr
}: {
    data: Genre, 
    setErr: Function
}) => {

    const [tempData, setTempData] = useState(defaultGerne)
    useEffect(() => {
        setTempData(data)
        storeDetailData(tempData)
    }, [data])
    useEffect(() => {
        storeDetailData(tempData)
    }, [tempData])
    
    const handleInputText = (e:any) => {
        const {name, value} = e.target

        setTempData({... tempData, [name]: value})
    }

    return (
        <>  
            <SmartInput label={'Název žánru'}>
                <input 
                    name={'name'}
                    type={'text'}
                    value={tempData.name}
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>
        </>
    )
}

export default GenreDetail