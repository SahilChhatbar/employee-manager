import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'dashboard',
        element: (
            <Dashboard />
         ),
      },
    ],
  },
]);

export default router;
