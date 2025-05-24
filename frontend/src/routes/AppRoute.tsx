import BookAppointmentPage from '@/pages/BookAppointment';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import {Routes, Route} from 'react-router-dom';

export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage/>}/>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book-appointment" element={<BookAppointmentPage />} />
      
    </Routes>
  )
}
export default AppRoute;