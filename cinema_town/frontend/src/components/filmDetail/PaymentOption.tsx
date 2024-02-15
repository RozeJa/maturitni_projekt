import { ReactElement } from 'react';
import './PaymentOption.css'

const PaymentOption = ({
        setPayment,
        payment,
        imgUrl,
        label
    }:{
        setPayment: Function,
        payment: ReactElement,
        imgUrl: string,
        label: string
    }) => {
    return (
        <div className='payment-option'>
            <input type="radio" name='payment' onChange={(e:any) => {
                const { checked } = e.target

                if (checked) {
                    setPayment(payment)
                } else {
                    setPayment(<></>)
                }
                
            }} />
            <label>{label}</label>
            <img src={require(`../../assets/imgs/payment-options/${imgUrl}`)} alt="" />
        </div>
    )
}

export default PaymentOption