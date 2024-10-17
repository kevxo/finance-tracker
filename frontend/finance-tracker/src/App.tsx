import { Login } from '../src/Componenets/Login/index'
import { Dashboard } from '../src/Componenets/Dashboard/index';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </Router>
  )
}

export default App
