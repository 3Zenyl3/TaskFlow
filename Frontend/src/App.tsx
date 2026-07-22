import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/Projects/Projects";
import Tasks from "./pages/Tasks/Tasks";
import Profile from "./pages/Profile/Profile";
import Calendar from "./pages/Calendar/Calendar";

function App() {
  return (
    <BrowserRouter basename="/TaskFlow">
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element = {<Dashboard/>} />
        <Route path="/dashboard/projects" element = {<Projects/>}/>
        <Route path="/dashboard/tasks" element = {<Tasks/>}/>
        <Route path="/dashboard/profile" element = {<Profile/>}/>
        <Route path="/dashboard/calendar" element = {<Calendar/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;