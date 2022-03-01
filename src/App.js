import React from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
//containers
import Home from "./container/Home-container/Home"
//components
import Login from "./components/login/Login.component"

function App() {
  return (
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="/*" element={<Home/>}/>
      </Routes>
  );
}

export default App;



//stopped at 38