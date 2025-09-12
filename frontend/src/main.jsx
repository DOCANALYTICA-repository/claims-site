import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import our context and pages
import { AuthProvider } from './context/AuthContext.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import HodDashboard from './pages/HodDashboard.jsx';
import CreateFormPage from './pages/CreateFormPage.jsx';
import YellowFormPage from './pages/YellowFormPage.jsx';
import ClubDashboard from './pages/ClubDashboard.jsx';
import PinkFormPage from './pages/PinkFormPage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import FormDetailsPage from './pages/FormDetailsPage.jsx';

// Define our routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/hod',
        element: (
          <ProtectedRoute>
            <HodDashboard />
          </ProtectedRoute>
        ),

      },
      {
        path: '/create-form',
        element: (
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        ),
      },
      { //                              <-- ADD THIS NEW ROUTE
        path: '/yellow-form',
        element: (
          <ProtectedRoute>
            <YellowFormPage />
          </ProtectedRoute>
        ),
      },
      { //                              <-- ADD THIS NEW ROUTE
        path: '/club',
        element: (
          <ProtectedRoute>
            <ClubDashboard />
          </ProtectedRoute>
        ),
      },
      { //                              <-- ADD THIS NEW ROUTE
        path: '/pink-form',
        element: (
          <ProtectedRoute>
            <PinkFormPage />
          </ProtectedRoute>
        ),
      },
      { //                              <-- ADD THIS NEW ROUTE
        path: '/teacher',
        element: (
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/form/:id', // <-- ADD NEW DYNAMIC ROUTE
        element: (
          <ProtectedRoute>
            <FormDetailsPage />
          </ProtectedRoute>
        ),
      },
      { //                              <-- ADD THIS NEW ROUTE
        path: '/re-apply/:id', // The :id is a dynamic parameter
        element: (
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);