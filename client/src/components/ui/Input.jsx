export function Input({ label, error, icon: Icon, className = "", type = "text", required = false, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    {label} {required && <span className="text-purple-500">*</span>}
                </label>
            )}
            <div className="relative rounded-xl">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    type={type}
                    className={`w-full  bg-zinc-800 border ${
                        error ? "border-purple-500 focus:ring-purple-500" : "border-zinc-700 focus:border-purple-600 focus:ring-purple-600"
                    } rounded-xl text-zinc-200 placeholder-zinc-300 text-sm ${
                        Icon ? "pl-10" : "pl-3.5"
                    } pr-3.5 py-2.5 transition duration-150 focus:outline-none focus:ring-1 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
