interface props {
    name: string,
    //fix onchange any
    onChange: any,
    placeholder: string,
    label: string,
    value: string | number,
    isNumber: boolean,
}

const SimpleInput = ({name, onChange, label, placeholder, value, isNumber}: props) => {
    return (
        <div>
            <label htmlFor={name} className="text-xs">{label}</label>
            <input type={isNumber ? "number" : "text"} min={isNumber ? "0" : undefined} max={isNumber ? "15" : undefined} name={name} onChange={onChange} className="pr-2 mr-5 border-slate-500 p-2 border-2 rounded block mb-4 bg-slate-900" placeholder={placeholder} value={value}/>
        </div>
    )
}

export default SimpleInput;