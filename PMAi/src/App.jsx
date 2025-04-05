import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import DashBoard from './pages/DashBoard'
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
            <div className="min-h-screen relative">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                    <div className="pt-16"> {/* Add padding to account for fixed navbar */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
                            <Route path="/signup" element={<Signup setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
                            <Route path="/dashboard" element={<DashBoard />} />
                            {/* <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/logout" element={<Logout />} /> */}
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
