import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'  // ✅ ADD THIS
import { Provider } from "react-redux"
import store from './state/Store.js'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>


    <StrictMode>
      <BrowserRouter>
        <AuthProvider>   {/* ✅ WRAP HERE */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </Provider>
)