import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#edf5f9] text-gray-300 text-sm py-4 px-6 flex flex-col md:flex-row justify-between items-center" >
    <p className="text-black font-semibold">© 2025 <a href="#" className="text-blue-500 hover:underline">Furniture</a></p>
    <p className="text-black font-semibold "> Designed & Developed by
      <a href="#" className="text-blue-500 hover:underline">Furniture</a>
    </p>
  </footer>
  )
}

export default Footer