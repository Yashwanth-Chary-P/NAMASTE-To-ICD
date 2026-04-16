
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
          <Route path='/login' element={<Auth/>}/>
        </Routes>

      <Footer/>
    </>
  )
}

export default App
