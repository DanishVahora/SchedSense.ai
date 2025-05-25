import BookAppointmentPage from '@/pages/customer/BookAppointment';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import {Routes, Route} from 'react-router-dom';
import ProviderDashboard from '@/pages/provider/ProviderDashboard';
import ManageServices from '@/pages/provider/ManageService';
import CustomerDashboard  from '@/pages/customer/CustomerDashboard';
export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage/>}/>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book-appointment" element={<BookAppointmentPage />} />
      <Route path="/ProviderDashboard" element={<ProviderDashboard />} />
      <Route path='/ProviderManage' element={<ManageServices/>}/>
      <Route path='/CustomerDashboard' element={<CustomerDashboard/>}/>
    </Routes>
  )
}
export default AppRoute;