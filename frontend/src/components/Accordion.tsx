'use client'

type props = {
    extra_classes?: string,
    children: ReactNode,
    initialContent: ReactNode,
    initialContentClasses?: string,
}

import {ReactNode, useState} from 'react';

const Accordion = ({extra_classes, initialContent, children, initialContentClasses}: props) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleIsOpen = () => {
        setIsOpen(!isOpen)
    }
    
    return (
        <div className={extra_classes}>
            <button className={initialContentClasses} onClick={toggleIsOpen}>
                {initialContent}
            </button>
            {
                isOpen ?
                <div>{children}</div> :
                null
            }
        </div>
    )
}

export default Accordion