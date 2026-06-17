import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AllProperties from './AllProperties'

const RenterHome = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">House Rent App</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name}</span>
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-white text-blue-700 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            My Bookings
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Available Properties</h2>
        <AllProperties />
      </div>
    </div>
  )
}

export default RenterHome