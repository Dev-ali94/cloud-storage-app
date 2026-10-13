import { XIcon } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-fade-in"
        >
            <div
                className={`w-full ${maxWidth} bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                    <h3 className="text-base font-medium text-zinc-100">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-zinc-100 hover:text-zinc-300 hover:bg-slate-100 transition">
                        <XIcon className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
