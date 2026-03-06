import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Toast from './components/Toast';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import Learn from './pages/Learn';
import About from './pages/About';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Advisor from './pages/Advisor';
import Admin from './pages/Admin';
import Certificate from './pages/Certificate';
import RentalCalculator from './pages/RentalCalculator';
import Market from './pages/Market';
import Wallet from './pages/Wallet';

function App() {
  return (
    <AppProvider>
      <Router basename="/newsite">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/certificate/:propertyId" element={<Certificate />} />
            <Route path="/calculator" element={<RentalCalculator />} />
            <Route path="/market" element={<Market />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="*" element={<div className="p-20 text-center text-text-secondary">404 Not Found</div>} />
          </Routes>
        </Layout>
        <Toast />
      </Router>
    </AppProvider>
  );
}

export default App;
