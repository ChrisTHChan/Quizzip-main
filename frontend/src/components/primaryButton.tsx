type props = {
    children: string,
    extra_classes?: string,
    disabled?: boolean,
    onClick?: any,
    type?: "button" | "submit" | "reset" | undefined
}

export default function PrimaryButton({children, extra_classes, disabled, onClick, type}: props) {
    return <button type={type} onClick={onClick} disabled={disabled} className={`${extra_classes ? extra_classes : ''} bg-blue-600 rounded py-2 px-4 hover:bg-blue-500 hover:border-blue-500 border-2 border-blue-600 font-semibold text-sm`}>{children}</button>
}