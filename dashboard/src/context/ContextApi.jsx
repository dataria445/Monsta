import React, { createContext, useState } from "react";

export const context = createContext();
function ContextApi({ children }) {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu ] =useState(null)
  const object = { openUserMenu, setOpenUserMenu ,openSubMenu, setOpenSubMenu };
  return (
    <>
      <context.Provider value={object}>{children}</context.Provider>
    </>
  );
}

export default ContextApi;
