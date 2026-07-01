// src/views/common/Navbar.jsx
// ====================================================
// COMPONENTE: NAVBAR
// ====================================================
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import '../../styles/Navbar.css'

const Navbar = () => {
    const { isAuthenticated, logout, currentUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/catalogo')
    }

    // No mostrar navbar en dashboard (ya tiene su propio header)
    if (location.pathname.includes('/dashboard')) {
        return null
    }

   
    
}

export default Navbar