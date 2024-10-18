import { Link, useLocation } from 'react-router-dom'
import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { useEffect, useState } from 'react';

export function NavbarComponent() {
    const [token, setToken] = useState<string | null>(null)
    const location = useLocation()

    useEffect(() => {
        const storedToken = localStorage.getItem('token')

        setToken(storedToken);
    }, [location])

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null)
    }

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="#">
        <img src="/finance-tracker.png" className="mr-3 h-6 sm:h-9" alt="Finance Tracker Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Finance Tracker</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        {token ? (
            <Link to="/" onClick={handleLogout}>
                Logout
            </Link>
        ) : null}
      </NavbarCollapse>
    </Navbar>
  );
}
