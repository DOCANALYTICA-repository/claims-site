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
import ReapplyYellowFormPage from './pages/ReapplyYellowFormPage.jsx';
import ReapplyYellowFormPage from './pages/ReapplyYellowFormPage.jsx';
import ReapplyPinkFormPage from './pages/ReapplyPinkFormPage.jsx';

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
      }, // <-- THE FIX: ADD A COMMA HERE
      {
        path: '/create-form',
        element: (
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/yellow-form',
        element: (
          <ProtectedRoute>
            <YellowFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/club',
        element: (
          <ProtectedRoute>
            <ClubDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/pink-form',
        element: (
          <ProtectedRoute>
            <PinkFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teacher',
        element: (
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/form/:id',
        element: (
          <ProtectedRoute>
            <FormDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/re-apply/:id',
        element: (
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/re-apply/yellow/:id',
        element: (
          <ProtectedRoute>
            <ReapplyYellowFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/re-apply/pink/:id',
        element: (
          <ProtectedRoute>
            <ReapplyPinkFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/re-apply/yellow/:id',
        element: (
          <ProtectedRoute>
            <ReapplyYellowFormPage />
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