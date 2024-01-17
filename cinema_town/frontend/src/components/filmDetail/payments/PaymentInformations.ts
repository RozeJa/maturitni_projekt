interface PaymentInformations {
    prePostFunction: (paymentData: { [key:string]: string }) => Promise<{ [key:string]: string }>, 
    paymentData: { [key:string]: string }
}

export default PaymentInformations
