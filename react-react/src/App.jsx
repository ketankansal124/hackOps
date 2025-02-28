import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterInvestor from "./components/auth/RegisterInvestor.jsx";
import Login from "./components/auth/login.jsx";
import RegisterStartup from "./components/auth/RegisterStartup.jsx";


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
