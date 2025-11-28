import FoodCard from './components/FoodCard'
import CreateItemPage from './pages/CreateItemPage'
import CreatePerfilPage from './pages/CreatePerfilPage'
import ItemMenu from './components/ItemMenu'
import MenuAdminPage from './pages/MenuAdminPage'
import MainPage from './pages/MainPage'
import MisPerfilesPage from './pages/MisPerfilesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ItemDetailPage from './pages/ItemDetailPage'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useEffect } from 'react'

import "./app.css"
function App() {
  // Set initial theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/menu-admin" element={<MenuAdminPage />} />
        <Route path="/crear-item" element={<CreateItemPage />} />
        <Route path="/crear-perfil" element={<CreatePerfilPage />} />
        <Route path="/mis-perfiles" element={<MisPerfilesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;