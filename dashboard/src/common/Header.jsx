import { useContext, useState } from "react";
import { Menu, User, Building2, LogOut } from "lucide-react";
import { context } from "../context/ContextApi";

export default function Header() {
  const [open, setOpen] = useState(false);
  let { openUserMenu } = useContext(context)

  return (
    <header className="md:w-full flex items-center justify-between  bg-white border-b shadow-sm">
      {/* Left Section (20% width with blue background) */}
      <div className="w-full md:w-1/5 flex items-center gap-3 bg-[#3F8EF7] px-4 py-3">
        <button
          className="lg:hidden p-2 rounded hover:bg-blue-600/40"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <img src="https://wscubetech.co/Assignments/furniture/storage/app/public/uploads/images/company-profile/logo/cccfbdab-3bec-439f-88b9-5694698cd302-1670132652.png"
            alt="Logo" className="w-20 h-8 md:w-28 md:h-10 object-contain" />
          <h1 className="font-bold text-base md:text-lg text-white">Furniture</h1>
        </div>
      </div>

      {/* Right Section (80% width) */}
      <div className=" flex justify-end pr-6  md:bg-white bg-[#3F8EF7]  py-[14px]">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white font-semibold"  >
          Ad
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-4 top-16 md:right-6 md:top-14 w-48 bg-white shadow-lg rounded-md border z-50">
            <ul className="text-sm text-gray-700">
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <User className="w-4 h-4" /> Profile
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Building2 className="w-4 h-4" /> Company Profile
              </li>
              <li className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">
                <LogOut className="w-4 h-4" /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
