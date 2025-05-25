import React from 'react';
import BookAppointmentPage from '@/pages/customer/BookAppointment';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import {Routes, Route, Navigate} from 'react-router-dom';
import ProviderDashboard from '@/pages/provider/ProviderDashboard';
import ManageServices from '@/pages/provider/ManageService';
import CustomerDashboard  from '@/pages/customer/CustomerDashboard';
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage/>}/>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route
                path="/CustomerDashboard"
                element={
                    <ProtectedRoute>
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ProviderDashboard"
                element={
                    <ProtectedRoute>
                        <ProviderDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}
export default AppRoute;