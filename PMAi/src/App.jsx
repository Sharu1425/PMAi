import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
//import Register from './pages/Register'
//import Dashboard from './pages/Dashboard'
//import Profile from './pages/Profile'
//import Settings from './pages/Settings'
//import Logout from './pages/Logout'

function App() {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])
    
    const handleLogout = () => {
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
    }
    
    return (
        <BrowserRouter>
            <div className="min-h-screen">
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
                    {/* <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/logout" element={<Logout />} /> */}
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
