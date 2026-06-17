import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AllProperties from './AllProperties'
import AddProperty from './AddProperty'
import AllBookings from './AllBookings'

const OwnerHome = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('properties')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">House Rent App — Owner</h1>
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

      {/* Tabs */}
      <div className="bg-white px-6 flex gap-6 border-b">
        {['properties', 'add', 'bookings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'properties' && 'My Properties'}
            {tab === 'add' && 'Add Property'}
            {tab === 'bookings' && 'Booking Requests'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'properties' && <AllProperties />}
        {activeTab === 'add' && <AddProperty onSuccess={() => setActiveTab('properties')} />}
        {activeTab === 'bookings' && <AllBookings />}
      </div>
    </div>
  )
}

export default OwnerHome