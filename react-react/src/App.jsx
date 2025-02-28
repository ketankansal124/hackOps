
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
=======
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

