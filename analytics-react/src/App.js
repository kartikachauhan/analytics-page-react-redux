import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Analytics from "./Components/Analytics/Analytics";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/analytics"
            element={<Analytics />}
          />
          <Route
            exact
            path="/"
            element={<Analytics />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;