import './Select.css'
import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

interface SelectOption {
    value: string,
    label: string,
}

function Select({id, value, onChange, options, disabled}: {
    id?: string,
    value: string,
    onChange: (value: string) => void,
    options: SelectOption[],
    disabled?: boolean,
}) {
    const [open, setOpen] = useState(false);
    const [menuRect, setMenuRect] = useState({top: 0, left: 0, width: 0});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const selectedLabel = options.find(option => option.value === value)?.label ?? '';

    useEffect(() => {
        if (!open) return;

        const updatePosition = () => {
            const rect = triggerRef.current?.getBoundingClientRect();
            if (rect) setMenuRect({top: rect.bottom, left: rect.left, width: rect.width});
        }

        updatePosition();

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        }

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [open]);

    return (
        <>
            <button
                type='button'
                id={id}
                ref={triggerRef}
                className='select-trigger'
                disabled={disabled}
                onClick={() => setOpen(o => !o)}
                aria-haspopup='listbox'
                aria-expanded={open}
            >
                <span>{selectedLabel}</span>
                <span className='select-caret'/>
            </button>

            {open && createPortal(
                <ul
                    ref={menuRef}
                    className='select-menu'
                    role='listbox'
                    style={{top: menuRect.top, left: menuRect.left, width: menuRect.width}}
                >
                    {options.map(option => (
                        <li
                            key={option.value}
                            role='option'
                            aria-selected={option.value === value}
                            className={`select-option${option.value === value ? ' selected' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>,
                document.body
            )}
        </>
    );
}

export default Select;
