import React, { useState, useEffect } from 'react'
import { 
    Outlet,
    Route, 
    Navigate,
    createRoutesFromElements,
    createBrowserRouter,
    RouterProvider,
    useLocation,
    useNavigate
} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import Dashboard from './pages/DashBoard'
import UserProfile from './pages/UserProfile'
import SymptomAnalyser from './pages/SymptomAnalyser'
import DietRecom from './pages/DietRecom'
import MedsReminder from './pages/MedsReminder'
import { Toaster } from 'react-hot-toast'
//import Settings from './pages/Settings'
//import Logout from './pages/Logout'

// Layout Component
const RootLayout = ({ isAuthenticated, user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to /login if not authenticated and on a protected route
    useEffect(() => {
        const protectedRoutes = [
            '/dashboard',
            '/profile',
            '/userprofile',
            '/symptoms',
            '/diet',
            '/reminders'
        ];
        if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, location.pathname, navigate]);

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground />
            <div className="relative z-10">
                <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={onLogout} />
                <main className="pt-16">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Protected Route Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setIsAuthenticated(true);
                setUser(parsedUser);
            } catch (e) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login'; // Force a full reload to clear any cached state
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }
    
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<RootLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route 
                    path="/login" 
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} 
                />
                <Route 
                    path="/signup" 
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} 
                />

                {/* Protected Routes */}
                <Route 
                    path="/dashboard" 
                    element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard user={user} /></ProtectedRoute>} 
                />
                <Route 
                    path="/profile" 
                    element={<ProtectedRoute isAuthenticated={isAuthenticated}><UserProfile user={user} /></ProtectedRoute>} 
                />
                <Route 
                    path="/userprofile" 
                    element={<ProtectedRoute isAuthenticated={isAuthenticated}><UserProfile user={user} /></ProtectedRoute>} 
                />
                <Route 
                    path="/symptoms" 
                    element={<ProtectedRoute isAuthenticated={isAuthenticated}><SymptomAnalyser user={user} /></ProtectedRoute>} 
                />
                <Route 
                    path="/diet" 
                    element={<ProtectedRoute isAuthenticated={isAuthenticated}><DietRecom user={user} /></ProtectedRoute>} 
                />
                <Route 
                    path="/reminders" 
                    element={<ProtectedRoute isAuthenticated={isAuthenticated}><MedsReminder user={user} /></ProtectedRoute>} 
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        ),
        {
            future: {
                v7_startTransition: true
            }
        }
    );
    
    return (
        <>
            <RouterProvider router={router} />
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#4caf50',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#f44336',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </>
    )
}

export default App
