import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import AboutPage from './Pages/About'
import Dashboard from './Pages/Dashboard'
import SearchFilter from './Pages/Search'
import Mapping from './Pages/Mapping'

// Auth
import Login from './Components/Login'
import Register from './Components/Register'
import Profile from './Pages/Profile'

// 🔥 ADD THIS
import PrivateRoute from './Routes/PrivateRoute'
import IcdSearch from './Pages/IcdSearch'
import Lookup from './features/LookUp'
import Search from './features/Search'
import Map from './features/Map'
import FhirStore from './features/FhirStore'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 🔓 Public */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* 🔒 Protected */}
        <Route path='/search' element={
          <PrivateRoute>
            <SearchFilter />
          </PrivateRoute>
        } />

        <Route path='/mapping' element={
          <PrivateRoute>
            <Mapping />
          </PrivateRoute>
        } />

        <Route path='/reports' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />


        <Route path="/icd-search" element={
          <PrivateRoute>
            <IcdSearch />
          </PrivateRoute>
        }
        />

        {/* 🔒 FHIR WORKFLOW */}
        <Route path='/fhir/lookup' element={
          <PrivateRoute>
            <Lookup />
          </PrivateRoute>
        } />

        <Route path='/fhir/search' element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        } />

        <Route path='/fhir/map' element={
          <PrivateRoute>
            <Map />
          </PrivateRoute>
        } />

        <Route path='/fhir/store' element={
          <PrivateRoute>
            <FhirStore />
          </PrivateRoute>
        } />

      </Routes>

      <Footer />
    </>
  )
}

export default App;