import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import FallbackSpinner from "./components/FallbackSpinner";

const Login = React.lazy(() => import("./routes/Login"));
const Home = React.lazy(() => import("./routes/Home"));

function App() {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
