import React from 'react';
import Home from './pages/Home';
import {BrowserRouter , Routes , Route} from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute";
import LoginRegApp from './components/LoginRegApp';
import ProductPage from './pages/ProductPage';
import ShoppingCart from './pages/ShoppingCart';
import ProductDisplay from './pages/ProductDisplay';
import CategoryDisplay from './pages/CategoryDisplay';
import Profile from './pages/Profile';

function App(){
    return(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginRegApp />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/product" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><ProductDisplay /></ProtectedRoute>} />
                <Route path="/category" element={<ProtectedRoute><CategoryDisplay /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
            </Routes>
        </BrowserRouter>
    </div>
    );
}

export default App;