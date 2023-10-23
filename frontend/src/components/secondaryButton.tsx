type props = {
    children: string,
    extra_classes?: string,
    disabled?: boolean,
    onClick?: any,
}

export default function SecondaryButton({children, extra_classes, onClick, disabled}: props) {
    return <button onClick={onClick} disabled={disabled} className={`${extra_classes} font-semibold text-sm rounded py-2 px-4 hover:bg-blue-500 hover:border-blue-500 border-2 border-slate-600`}>{children}</button>
}