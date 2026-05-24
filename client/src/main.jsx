import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'
import { LocationProvider } from './context/LocationContext'
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LocationProvider>
    </BrowserRouter>
  </React.StrictMode>
)
 