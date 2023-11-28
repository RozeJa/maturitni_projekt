import './GenreDetail.css'
import Genre from '../../../models/Genre'
import SmartInput from '../../../components/SmartInput'

export const validateGenre = (data: Genre): Array<string> => {
    let errs: Array<string> = []

    if (data.name === '') {
        errs.push('Abyste mohly úspěšně odeslat formulář musíte vyplnit název žánru.')
    }

    return errs
}

const GenreDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Genre, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {

    return (
        <>
           <label>Název žánru</label>
           <input name='name' type="text" value={data.name} placeholder='název žánru' onChange={(e: any) => handleInputText(e)} />
            <SmartInput
                label={'Název žánru'}
                name={'name'}
                type={'text'}
                value={data.name}
                onChange={(e: any) => handleInputText(e)}
                >
            </SmartInput>   
        </>
    )
}

export default GenreDetail