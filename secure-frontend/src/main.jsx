import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import keycloak from './keycloak.js'

keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false })
    .then((authenticated) => {
        createRoot(document.getElementById('root')).render(
            <StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </StrictMode>,
        )
    })
    .catch(console.error);