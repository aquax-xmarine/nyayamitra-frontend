import logo from "../assets/logo.png";

export default function LoginNavbarIcon() {

    return (
            <div className="flex items-center justify-center gap-3 py-2"
                
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#A39E9E' }}
                >
                <img
                    src={logo}
                    alt="logo"
                    onClick={() => window.location.href = '/'}
                    className="w-8 h-7 object-contain border border-black rounded-[7px] cursor-pointer"
                />
            </div>
    );
};