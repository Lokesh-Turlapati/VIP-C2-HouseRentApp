import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600'
}

const AllBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/admin/bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (bookings.length === 0) return <p className="text-gray-500">No bookings yet.</p>

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">Property</th>
            <th className="text-left px-4 py-3">Tenant</th>
            <th className="text-left px-4 py-3">Owner</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-t">
              <td className="px-4 py-3">{b.property?.title}</td>
              <td className="px-4 py-3">{b.tenant?.name} ({b.tenant?.email})</td>
              <td className="px-4 py-3">{b.owner?.name} ({b.owner?.email})</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                  {b.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AllBookings