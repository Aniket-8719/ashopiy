import React, { useEffect, useState } from 'react'
import TopNavbar from './TopNavbar'
import SideNavbar from './SideNavbar'

const Navbar = () => {
    const [mobileToggle, setMobileToggle] = useState(true);
    useEffect(() => { 
        let handler = () => {
          setMobileToggle(true); 
        };
        document.addEventListener("mousedown", handler);
      });
  return (
    <>
       <TopNavbar mobileToggle={mobileToggle} setMobileToggle={setMobileToggle}/>
       <SideNavbar mobileToggle={mobileToggle} setMobileToggle={setMobileToggle}/>
    </>
  )
}

export default Navbar
