 
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInstance'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600'
}

const MyBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get('/user/bookings')
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id) => {
    try {
      await axiosInstance.put(`/user/bookings/${id}/cancel`)
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Bookings</h1>
        <button
          onClick={() => navigate('/renter/dashboard')}
          className="bg-white text-blue-700 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          Back to Properties
        </button>
      </nav>

      <div className="p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">You haven't made any booking requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-800">{b.property?.title}</h3>
                <p className="text-sm text-gray-500">{b.property?.address?.city}</p>
                <p className="text-sm text-gray-600">₹{b.monthlyRent}/month</p>
                <p className="text-sm text-gray-500">Owner: {b.owner?.name} ({b.owner?.email})</p>
                <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${statusColors[b.status]}`}>
                  {b.status.toUpperCase()}
                </span>
                {b.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600 mt-2"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings