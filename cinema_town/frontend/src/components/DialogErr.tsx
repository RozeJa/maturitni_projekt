import './DialogErr.css'

const DialogErr = ({err, description, dialogSetter}: {err: string, description: string, dialogSetter: Function}) => {

    return (
        <div className='dialog-err'>
            <div className="dialog-err-body">
                <h1>{err}</h1>
                <p>{description}</p>
            </div>
            <div className='dialog-err-ok' onClick={() => {                    
                    dialogSetter(<></>)
                }}>Ok</div>
        </div>
    )
}

export default DialogErr