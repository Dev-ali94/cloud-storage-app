import { useState, useRef, useEffect } from "react";

export function Dropdown({ trigger, children, align = "right", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const alignStyle = align === "right" ? "right-0" : "left-0";

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

            {isOpen && (
                <div
                    className={`absolute ${alignStyle} mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 py-1.5 z-50 animate-fade-in ${className}`}
                    onClick={() => setIsOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export function DropdownItem({ children, icon: Icon, onClick, danger = false, disabled = false }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition ${
                danger ? "text-red-600 hover:bg-red-500/30 hover:text-red-700" : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {Icon && <Icon className="size-4 shrink-0" />}
            <span>{children}</span>
        </button>
    );
}
