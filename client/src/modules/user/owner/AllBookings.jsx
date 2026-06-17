import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600'
}

const AllBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get('/owner/bookings')
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

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(`/owner/bookings/${id}/status`, { status })
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (bookings.length === 0) return <p className="text-gray-500">No booking requests yet.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((b) => (
        <div key={b._id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-800">{b.property?.title}</h3>
          <p className="text-sm text-gray-500">{b.property?.address?.city} • ₹{b.property?.rentAmount}/month</p>
          <p className="text-sm text-gray-600">Tenant: {b.tenant?.name} ({b.tenant?.email})</p>
          {b.tenantPhone && <p className="text-sm text-gray-600">Phone: {b.tenantPhone}</p>}
          {b.tenantMessage && <p className="text-sm text-gray-500 italic">"{b.tenantMessage}"</p>}

          <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${statusColors[b.status]}`}>
            {b.status.toUpperCase()}
          </span>

          {b.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleStatusUpdate(b._id, 'approved')}
                className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(b._id, 'rejected')}
                className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AllBookings