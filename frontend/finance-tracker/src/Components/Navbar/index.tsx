import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'



interface DecodedToken {
  exp: number; // Expiration time in seconds
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < currentTime;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true; // If token is invalid, treat it as expired
  }
};

export function NavbarComponent() {
    const [token, setToken] = useState<string | null>(null)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const storedToken = localStorage.getItem('token')

        if (storedToken && isTokenExpired(storedToken)) {
          handleLogout();
          navigate('/')
        } else {
          setToken(storedToken);
        }

    }, [location, navigate])

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
        {token && (
            <Link to="/" onClick={handleLogout}>
                Logout
            </Link>
        )}

        {window.location.pathname === '/signUp' && (
          <Link to="/">
            Login
          </Link>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
