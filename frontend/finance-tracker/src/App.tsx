import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Dashboard } from './Components/Dashboard/index';
import { Login,  } from './Components/Login/index'
import { NavbarComponent } from './Components/Navbar/index';
import { SignUp } from './Components/SignUp/index'


export function App() {
  return (
    <Router>
      <div>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  )
}

