import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterInvestor from "./components/Auth/RegisterInvestor.jsx";
import Login from "./components/Auth/login.jsx";
import RegisterStartup from "./components/Auth/RegisterStartup.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup/investor" element={<RegisterInvestor />} />
        <Route path="/signup/startup" element={<RegisterStartup  />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
