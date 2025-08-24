import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/login/Login';
import SinglePlayer from '../components/game/SinglePlayer';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../components/dashboard/Dashboard';
import Layout from '../components/common/Layout';
import Leaderboard from '../components/leaderbord/Leaderboard';
import Multiplayer from '../components/multiplayer/Multiplayer';

function App() {
  return (
    <Router basename="/flip-it/">
      <div className="App">
        <Routes>
          <Route path="" element={<Login />} />

          <Route path="/game"
            element={
              <Layout>
                <ProtectedRoute>
                  <SinglePlayer />
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

          <Route path="/leaderboard"
            element={
              <Layout>
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route path="/multiplayer"
            element={
              <Layout>
                <ProtectedRoute>
                  <Multiplayer />
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