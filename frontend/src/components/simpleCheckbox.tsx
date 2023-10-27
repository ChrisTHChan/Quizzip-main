interface props {
    //fix on change any
    onChange: any,
    checkedState: boolean,
    name: string,
    label: string,
    extra_classes?: string,
}

const SimpleCheckbox = ({onChange, checkedState, name, label, extra_classes}: props) => {
    return (
        <div className={extra_classes}>
            <input className="mr-1" id={name} onChange={onChange} checked={checkedState} type="checkbox" name={name}/>
            <label htmlFor={name}>{label}</label>
        </div>
    )
}

export default SimpleCheckbox