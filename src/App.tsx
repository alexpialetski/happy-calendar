import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Calendar } from "./pages/Calendar";
import { People } from "./pages/People";
import { Dashboard } from "./components/Dashboard";
import { UserContextProvider } from "./context/UserContext";

const App: React.FC = () => (
  <BrowserRouter>
    <UserContextProvider>
      <Dashboard>
        <Routes>
          <Route path="/calendar/:userId" element={<Calendar />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/people" element={<People />} />
          <Route path="*" element={<Navigate to="/people" />} />
        </Routes>
      </Dashboard>
    </UserContextProvider>
  </BrowserRouter>
);

export default App;
