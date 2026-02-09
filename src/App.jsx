import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="*" element={<div className="p-20 text-center text-text-secondary">404 Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
