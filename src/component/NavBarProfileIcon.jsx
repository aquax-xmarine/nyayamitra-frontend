import logo from "../assets/logo.png";

export default function LoginNavbarIcon() {

    return (
        <div className="flex items-center justify-center gap-3">
            <button
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#A39E9E' }}>
                <img
                    src={logo}
                    alt="logo"
                    className="w- h-7 object-contain border border-black rounded-[7px]"
                />
            </button>
        </div>
    );
};


