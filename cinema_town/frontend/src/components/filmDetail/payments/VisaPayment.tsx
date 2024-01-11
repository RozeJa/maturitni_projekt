import { useEffect, useState } from 'react'
import SmartInput from '../../SmartInput'
import './VisaPayment.css'

const VisaPayment = ({
    setPaymentData,
    paymentData
}:{
    setPaymentData: Function,
    paymentData: { [key:string]: string }
}) => {

    const [data, setData] = useState({...paymentData})

    useEffect(() => {
        console.log(data);
                
        setPaymentData({...data})
    }, [data])
    

    if (data["type"] !== "visa") {
        data["type"] = "visa"
        setData({...data})
    }

    const showCardNumber = (cardNumber: string|undefined):string => {
        if (cardNumber === undefined) 
            return ''
        
        const arr = cardNumber.split(/([0-9]{4})/).filter(number => number !== '')
        return arr.join(" ")
    } 


    const showCardExpiration = (cardExpiration: string|undefined):string => {
        if (cardExpiration === undefined) 
            return ''
        
        const arr = cardExpiration.split(/([0-9]{2})/).filter(number => number !== '')
        return arr.join("/")
    }

    const validateData = (data: { [key:string]: string }): boolean => {
        const number = data['card-number']?.length === 16
        const expiration = data['card-expiration']?.length === 4
        const verification = data['verification-code']?.length === 3 || data['verification-code']?.length === 4       

        return number && expiration && verification
    }

    const handleChange = (e:any) => {
        const { name, value } = e.target

        const newValue = value.replaceAll(" ", "").replaceAll("/", "")

        if (name === 'card-number' && newValue.length > 16) {
            return
        }

        if (name === 'card-expiration' && newValue.length > 4) {
            return
        }

        if (name === 'verification-code' && newValue.length > 4) {
            return
        }
        
        setData({...data, [name]: newValue, ["valid"]: validateData({...data, [name]: newValue}).toString()})
    }

    return (
        <div className='visa-payment'>
            <SmartInput label='Číslo kreditní karty'>
                <input 
                    type="text" 
                    name='card-number' 
                    value={showCardNumber(data["card-number"])} 
                    onChange={handleChange}  />
            </SmartInput>
            <SmartInput label='Platnost karty'>
                <input 
                    type="text" 
                    name='card-expiration' 
                    value={showCardExpiration(data["card-expiration"])} 
                    onChange={handleChange} />
            </SmartInput>
            <SmartInput label='CVV2/CVC2'>
                <input 
                    type="text" 
                    name='verification-code' 
                    value={data["verification-code"]} 
                        onChange={handleChange} />
            </SmartInput>
        </div>
    )
}

export default VisaPayment