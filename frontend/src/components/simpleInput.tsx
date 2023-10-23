interface props {
    name: string,
    //fix onchange any
    onChange: any,
    placeholder: string,
    label: string,
    value: string | number,
    type?: string,
    extra_classes?: string
}

const SimpleInput = ({name, onChange, label, placeholder, value, extra_classes, type}: props) => {
    return (
        <div>
            <label htmlFor={name} className="text-xs">{label}</label>
            <input type={type} min={type === "number" ? "0" : undefined} max={type === "number" ? "15" : undefined} name={name} onChange={onChange} className={`${extra_classes} pr-2 mr-5 border-slate-500 p-2 border-2 rounded block mb-4 bg-slate-900`} placeholder={placeholder} value={value}/>
        </div>
    )
}

export default SimpleInput;