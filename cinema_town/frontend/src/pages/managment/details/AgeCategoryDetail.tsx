import { useEffect, useState } from 'react'
import AgeCategory, { defaultAgeCategory } from '../../../models/AgeCategory'
import './AgeCategoryDetail.css'
import { storeDetailData } from './Detail'
import SmartInput from '../../../components/SmartInput'

export const validateAgeCategory = (data: AgeCategory): Array<string> => {
    let errs: Array<string> = []

    if (data.name.trim() === '')
        errs.push("Název cenové kategorie musí být vyplněn.")
    if (data.priceModificator < 0) {
        errs.push("Modifikátor ceny namůže být menší než 0.")
    }

    return errs;
}

const AgeCategoryDetail = ({
        data,
        setErr
    }:{
        data: AgeCategory,
        setErr: Function    
    }) => {

    const [tempData, setTempData] = useState({...defaultAgeCategory})
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

    const handleInputNumber = (e:any) => {
        const {name, value} = e.target

        const number = parseFloat(value)

        if (number >= 0)
            setTempData({... tempData, [name]: number})
    }

    return (
        <>
            <SmartInput label={'Název kategorie'}>
                <input 
                    name={'name'}
                    type={'text'}
                    value={tempData.name}
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>
            <SmartInput label={'Cenový modifokátor'}>
                <input 
                    name={'priceModificator'}
                    type={'number'}
                    value={tempData.priceModificator}
                    onChange={(e: any) => handleInputNumber(e)} />
            </SmartInput>
        </>
    )
}

export default AgeCategoryDetail