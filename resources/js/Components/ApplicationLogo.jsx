export default function ApplicationLogo({
    className = '',
    imgClassName = 'h-10 w-auto object-contain rounded-xl shadow-lg shadow-rose-950/40 border border-slate-700/50',
    showText = true,
    ...props
}) {
    return (
        <div className={`flex items-center gap-3 ${className}`} {...props}>
            <img
                src="/logo_1.jpeg"
                alt="Cinevia Logo"
                className={imgClassName}
            />
            {showText && (
                <div className="flex flex-col text-left">
                    <span className="text-xl font-black tracking-wider text-white font-sans flex items-center gap-1">
                        CINE<span className="text-rose-500">VIA</span>
                    </span>
                    <span className="text-[9px] tracking-widest text-slate-400 uppercase font-semibold -mt-1">
                        Cinema Experience
                    </span>
                </div>
            )}
        </div>
    );
}
