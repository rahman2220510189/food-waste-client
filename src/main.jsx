import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/Router';
import AuthProviders from './firebase/Provider/AuthProviders';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProviders>
        <RouterProvider router={router} />
    
    </AuthProviders>
  </React.StrictMode>
);

