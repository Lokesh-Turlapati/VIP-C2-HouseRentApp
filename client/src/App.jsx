import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './modules/common/Home'
import Login from './modules/common/Login'
import Register from './modules/common/Register'
import ForgotPassword from './modules/common/ForgotPassword'
import RenterHome from './modules/user/renter/RenterHome'
import MyBookings from './modules/user/renter/MyBookings'
import OwnerHome from './modules/user/owner/OwnerHome'
import AdminHome from './modules/admin/AdminHome'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />

          <Route path='/renter/dashboard' element={
            <ProtectedRoute allowedRoles={['user']}>
              <RenterHome />
            </ProtectedRoute>
          } />

          <Route path='/my-bookings' element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyBookings />
            </ProtectedRoute>
          } />

          <Route path='/owner/dashboard' element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerHome />
            </ProtectedRoute>
          } />

          <Route path='/admin/dashboard' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App