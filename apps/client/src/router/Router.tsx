import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/login/Login';
import Game from '../components/game/Game';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../components/dashboard/Dashboard';
import Layout from '../components/common/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="" element={<Login />} />
          
          <Route path="/game" 
          element={
            <Layout>
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            </Layout>
          }
          />

        <Route path="/dashboard" 
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;