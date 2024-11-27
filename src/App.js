import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestBackendConnection from "./components/testBackendConnection";
import DiaryPage from "./components/DiaryPage";
import { useState } from "react";

function App() {
  const [userId] = useState("");
  const [setEntries] = useState([]);

  const handleEntriesUpdate = (newEntries) => {
    setEntries(newEntries);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="/test" element={<TestBackendConnection />} />
          {/* Add the new DiaryPage route */}
          <Route
            path="/diary"
            element={
              <PrivateRoute>
                <DiaryPage
                  userId={userId}
                  onEntriesUpdate={handleEntriesUpdate}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
