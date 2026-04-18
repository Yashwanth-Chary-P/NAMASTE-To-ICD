import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import AboutPage from './Pages/About'
import Dashboard from './Pages/Dashboard'
import SearchFilter from './Pages/Search'
import Mapping from './Pages/Mapping'
import Auth from './Pages/Auth'

// ✅ ADD THESE
import Login from './Components/Login'
import Register from './Components/Register'

function App() {

  return (
    <>
      <Navbar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/search' element={<SearchFilter/>}/>
        <Route path='/mapping' element={<Mapping/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/reports' element={<Dashboard/>}/>

        {/* ✅ NEW ROUTES */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>

      <Footer/>
    </>
  )
}

export default App