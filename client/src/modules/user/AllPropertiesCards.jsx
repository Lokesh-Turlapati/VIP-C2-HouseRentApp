import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'

const AllPropertiesCards = ({ property }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    tenantPhone: '', tenantMessage: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleBook = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/user/bookings', {
        propertyId: property._id,
        ...formData
      })
      setSuccess('Booking request sent successfully!')
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{property.title}</h3>
        <p className="text-sm text-gray-500">
          {property.address.street}, {property.address.city}, {property.address.state}
        </p>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>₹{property.rentAmount}/month</span>
        <span>{property.bedrooms} BHK • {property.bathrooms} Bath</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {property.available ? 'Available' : 'Not Available'}
        </span>
        <span className="text-gray-500">{property.furnished ? 'Furnished' : 'Unfurnished'}</span>
      </div>

      <div className="text-sm text-gray-500">
        <span>Owner: {property.owner?.name} ({property.owner?.email})</span>
      </div>

      {success && <p className="text-green-600 text-sm">{success}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {property.available && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Get Info / Book'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleBook} className="flex flex-col gap-2 mt-2">
          <input
            type="tel"
            placeholder="Your phone number"
            value={formData.tenantPhone}
            onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Message to owner (optional)"
            value={formData.tenantMessage}
            onChange={(e) => setFormData({ ...formData, tenantMessage: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            rows={2}
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Send Booking Request
          </button>
        </form>
      )}
    </div>
  )
}

export default AllPropertiesCards