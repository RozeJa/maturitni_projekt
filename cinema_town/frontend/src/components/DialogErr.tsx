import './DialogErr.css'

const DialogErr = ({
        err, 
        description, 
        dialogSetter, 
        okText
    }: {
        err: string, 
        description: string, 
        dialogSetter: Function, 
        okText: string | JSX.Element
    }) => {

    return (
        <div className='dialog'>
            <div className='dialog-err'>
                <div className="dialog-err-body">
                    <h1>{err}</h1>
                    <p>{description}</p>
                </div>
                <div className='dialog-err-ok' onClick={() => {                    
                        dialogSetter(<></>)
                    }}><p>{okText}</p></div>
            </div>
        </div>
    )
}

export default DialogErr