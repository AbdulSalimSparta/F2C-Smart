import React from 'react';
import Home from './pages/Home';
import {BrowserRouter , Routes , Route} from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginRegApp from './components/LoginRegApp';
import ProductPage from './pages/ProductPage';
import ShoppingCart from './pages/ShoppingCart';
import ProductDisplay from './pages/ProductDisplay';
import CategoryDisplay from './pages/CategoryDisplay';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';
import OrdersPage from './pages/Orders';
import SellerHome from './pages/SellerHome';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './routes/PrivateRoute';

function App(){
    return(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginRegApp />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/seller-home" element={<PrivateRoute allowedRoles={["seller"]}><SellerHome /></PrivateRoute>}  />
                <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute>} />
                <Route path="/product" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/category" element={<ProtectedRoute><CategoryDisplay /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/products/:productId" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    </div>
    );
}

export default App;