import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AllUsers from './AllUsers'
import AllProperty from './AllProperty'
import AllBookings from './AllBookings'

const AdminHome = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">House Rent App — Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="bg-white px-6 flex gap-6 border-b">
        {['users', 'properties', 'bookings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'users' && 'Users & Owner Approvals'}
            {tab === 'properties' && 'All Properties'}
            {tab === 'bookings' && 'All Bookings'}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'users' && <AllUsers />}
        {activeTab === 'properties' && <AllProperty />}
        {activeTab === 'bookings' && <AllBookings />}
      </div>
    </div>
  )
}

export default AdminHome