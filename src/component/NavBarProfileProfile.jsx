import cat from "../assets/car.jpg";
import { SlArrowDown } from "react-icons/sl";


export default function LoginNavbarProfile() {

    return (

        <div className="flex items-center justify-start p-2 w-40">
            <div className="h-9 w-9">
                <img
                src={cat}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
                />
            </div>

            <button
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#000000' }}
            >
                <SlArrowDown />
            </button>
        </div>
  );
};
