import './App.css'
import { Routes, Route } from 'react-router-dom'
import { LoginForm } from './pages/login-form'
import { SignupForm } from './pages/signup-form'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignupForm />} />
    </Routes>
  );
}

export default App
