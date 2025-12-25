import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { RiDashboard2Line } from "react-icons/ri";
import { GrUserManager, GrCatalogOption, GrCatalog } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { TbBrandGoogleBigQuery } from "react-icons/tb";
import { FcDataConfiguration, FcFaq } from "react-icons/fc";
import { SiPayloadcms } from "react-icons/si";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import { context } from "../../context/ContextApi";

// ---------------- MENU CONFIG ----------------
const menuItems = [
  { title: "Dashboard", icon: <RiDashboard2Line />, link: "/Dashboard" },

  {
    title: "User Management",
    icon: <GrUserManager />,
    sub: [
      { name: "Admin", to: "/Admin" },
      { name: "Users", to: "/Users" },
    ],
  },

  {
    title: "Location",
    icon: <IoLocationOutline />,
    sub: [{ name: "Countries", to: "/Countries" }],
  },

  {
    title: "Master Catalogue",
    icon: <GrCatalogOption />,
    sub: [
      { name: "Slider", to: "/Slider" },
      { name: "Testimonial", to: "/Testimonial" },
      { name: "Why Choose Us", to: "/Choose" },
      { name: "Coupoun", to: "/Coupoun" },
    ],
  },

  {
    title: "Product Catalogue",
    icon: <GrCatalog />,
    sub: [
      {
        name: "Category",
        to: "/Category",
        // children: [
        //   { name: "Add Category", to: "/AddCategory" },
        //   { name: "View Category", to: "/ViewCategory" },
        // ],
      },
      {
        name: "SubCategory",
        to: "/subcategory",
        // children: [
        //   { name: "Add SubCategory", to: "/AddSubCategory" },
        //   { name: "View SubCategory", to: "/ViewSubCategory" },
        // ],
      },
      {
        name: "SubSubCategory",
        to: "/subsubcategory",
        // children: [
        //   { name: "Add SubSubCategory", to: "/AddSubSubCategory" },
        //   { name: "View SubSubCategory", to: "/ViewSubSubCategory" },
        // ],
      },
      { name: "Material", to: "/Material" },
      { name: "Colors", to: "/Colors" },
      { name: "Product", to: "/Product" },
    ],
  },

  {
    title: "Enquiry",
    icon: <TbBrandGoogleBigQuery />,
    sub: [
      { name: "Contact Enquiry", to: "/Contact" },
      { name: "Newsletters", to: "/NewsLetter" },
    ],
  },

  {
    title: "Configuration",
    icon: <FcDataConfiguration />,
    sub: [
      { name: "Payment Gateways", to: "/PaymentGateway" },
      { name: "Configuration", to: "/Configuration" },
    ],
  },

  { title: "Faqs", icon: <FcFaq />, link: "/Faqs" },
  { title: "CMS Pages", icon: <SiPayloadcms />, link: "/Cms" },
];

function LeftSideMenu() {
  const { openUserMenu, setOpenUserMenu, openSubMenu, setOpenSubMenu } =
    useContext(context);

  const toggleMain = (title) => {
    setOpenUserMenu(openUserMenu === title ? null : title);
    setOpenSubMenu(null);
  };

  const toggleSub = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  return (
    <ul className="px-4 py-4 space-y-4 text-sm">
      {menuItems.map((item) => (
        <li key={item.title} className="border-b border-gray-600 py-1  ">

          {/* SIMPLE LINK MENU (Dashboard, Faqs, CMS Pages) */}
          {item.link ? (
            <Link
              to={item.link}
              className="flex items-center gap-4 hover:text-white "
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ) : (
            <>
              {/* MAIN MENU BUTTON */}
              <div
                onClick={() => toggleMain(item.title)}
                className="flex items-center justify-between cursor-pointer hover:text-white py-1 "
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <span className="text-lg">
                  {openUserMenu === item.title ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </div>

              {/* SUBMENU */}
              {openUserMenu === item.title && item.sub && (
                <ul className="ml-10 mt-3 space-y-3 text-gray-300">
                  {item.sub.map((subItem) => (
                    <li key={subItem.name}>

                      {/* SUB ITEM WITH CHILDREN (Dropdown) */}
                      {subItem.children ? (
                        <div
                          onClick={() => toggleSub(subItem.name)}
                          className="cursor-pointer flex justify-between items-center py-1 hover:text-white"
                        >
                          <span>{subItem.name}</span>
                          <span className="text-md">
                            {openSubMenu === subItem.name ? (
                              <IoIosArrowUp />
                            ) : (
                              <IoIosArrowDown />
                            )}
                          </span>
                        </div>
                      ) : (
                        /* SUB ITEM WITHOUT CHILDREN → DIRECT LINK */
                        <Link
                          to={subItem.to}
                          className="block py-1 hover:text-white cursor-pointer"
                        >
                          {subItem.name}
                        </Link>
                      )}

                      {/* NESTED CHILDREN */}
                      {subItem.children && openSubMenu === subItem.name && (
                        <ul className="ml-6 mt-2 space-y-2 text-gray-400 text-xs">
                          {subItem.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                to={child.to}
                                className="block hover:text-white"
                              >
                                ▸ {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}

                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default LeftSideMenu;
