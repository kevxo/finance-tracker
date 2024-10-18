import { Login } from '../src/Componenets/Login/index'
import { Dashboard } from '../src/Componenets/Dashboard/index';
import { SignUp } from '../src/Componenets/SignUp/index'
import { NavbarComponent } from '../src/Componenets/Navbar/index';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
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

export default App
