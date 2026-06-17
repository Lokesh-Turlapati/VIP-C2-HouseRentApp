import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'

const AllProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/owner/properties')
      setProperties(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    try {
      await axiosInstance.delete(`/owner/properties/${id}`)
      setProperties(properties.filter((p) => p._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleToggleAvailability = async (id) => {
    try {
      const res = await axiosInstance.put(`/owner/properties/${id}/availability`)
      setProperties(properties.map((p) => (p._id === id ? res.data.property : p)))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update')
    }
  }

  const startEdit = (property) => {
    setEditingId(property._id)
    setEditData({
      title: property.title,
      description: property.description,
      rentAmount: property.rentAmount,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      furnished: property.furnished,
      street: property.address.street,
      city: property.address.city,
      state: property.address.state,
      pincode: property.address.pincode
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditData({ ...editData, [name]: type === 'checkbox' ? checked : value })
  }

  const saveEdit = async (id) => {
    try {
      const res = await axiosInstance.put(`/owner/properties/${id}`, {
        title: editData.title,
        description: editData.description,
        rentAmount: Number(editData.rentAmount),
        bedrooms: Number(editData.bedrooms),
        bathrooms: Number(editData.bathrooms),
        furnished: editData.furnished,
        address: {
          street: editData.street,
          city: editData.city,
          state: editData.state,
          pincode: editData.pincode
        }
      })
      setProperties(properties.map((p) => (p._id === id ? res.data : p)))
      cancelEdit()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save changes')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (properties.length === 0) return <p className="text-gray-500">You haven't added any properties yet.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property._id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
          {editingId === property._id ? (
            <>
              <input name="title" value={editData.title} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Title" />
              <textarea name="description" value={editData.description} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Description" />
              <div className="grid grid-cols-2 gap-2">
                <input name="street" value={editData.street} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Street" />
                <input name="city" value={editData.city} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="City" />
                <input name="state" value={editData.state} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="State" />
                <input name="pincode" value={editData.pincode} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Pincode" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input name="rentAmount" type="number" value={editData.rentAmount} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Rent" />
                <input name="bedrooms" type="number" value={editData.bedrooms} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Bedrooms" />
                <input name="bathrooms" type="number" value={editData.bathrooms} onChange={handleEditChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Bathrooms" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="furnished" checked={editData.furnished} onChange={handleEditChange} />
                Furnished
              </label>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(property._id)} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700">Save</button>
                <button onClick={cancelEdit} className="flex-1 bg-gray-300 text-gray-700 py-1.5 rounded-lg text-sm hover:bg-gray-400">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-800">{property.title}</h3>
              <p className="text-sm text-gray-500">
                {property.address.street}, {property.address.city}, {property.address.state}
              </p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{property.rentAmount}/month</span>
                <span>{property.bedrooms} BHK • {property.bathrooms} Bath</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${property.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {property.available ? 'Available' : 'Not Available'}
              </span>

              <div className="flex gap-2 mt-2">
                <button onClick={() => startEdit(property)} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700">
                  Edit
                </button>
                <button onClick={() => handleToggleAvailability(property._id)} className="flex-1 bg-yellow-500 text-white py-1.5 rounded-lg text-sm hover:bg-yellow-600">
                  Toggle
                </button>
                <button onClick={() => handleDelete(property._id)} className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default AllProperties