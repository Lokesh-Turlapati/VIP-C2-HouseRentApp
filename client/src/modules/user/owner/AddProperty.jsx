 
import { useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'

const AddProperty = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', rentAmount: '', bedrooms: '', bathrooms: '',
    furnished: false, street: '', city: '', state: '', pincode: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axiosInstance.post('/owner/properties', {
        title: formData.title,
        description: formData.description,
        rentAmount: Number(formData.rentAmount),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        furnished: formData.furnished,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      })
      setSuccess('Property added successfully!')
      setFormData({
        title: '', description: '', rentAmount: '', bedrooms: '', bathrooms: '',
        furnished: false, street: '', city: '', state: '', pincode: ''
      })
      if (onSuccess) setTimeout(onSuccess, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Add New Property</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 col-span-2" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 col-span-2" rows={3} />

        <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />

        <input name="rentAmount" type="number" placeholder="Rent Amount" value={formData.rentAmount} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="bedrooms" type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="bathrooms" type="number" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} />
          Furnished
        </label>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded-lg col-span-2 hover:bg-blue-700">
          {loading ? 'Adding...' : 'Add Property'}
        </button>
      </form>
    </div>
  )
}

export default AddProperty