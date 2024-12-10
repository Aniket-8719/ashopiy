import React, { useEffect, useState } from 'react';
import TopNavbar from './TopNavbar';
import SideNavbar from './SideNavbar';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileToggle, setMobileToggle] = useState(true);

  useEffect(() => { 
    let handler = () => {
      setMobileToggle(true); 
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const location = useLocation();

  // Paths where the side navbar should be hidden
  const noSideNavbarPaths = ["/login", "/register", "/password/forgot"];
  
  // Check if the path matches exact routes or starts with /password/reset/
  const hideSideNavbar = noSideNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/password/reset/');

  return (
    <>
      <TopNavbar mobileToggle={mobileToggle} setMobileToggle={setMobileToggle}/>
      {!hideSideNavbar && (
        <SideNavbar mobileToggle={mobileToggle} setMobileToggle={setMobileToggle}/>
      )}
    </>
  );
};

export default Navbar;
