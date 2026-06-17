 
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'

const AllProperty = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      const res = await axiosInstance.get('/admin/properties')
      setProperties(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return
    try {
      await axiosInstance.delete(`/admin/properties/${id}`)
      fetchProperties()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (properties.length === 0) return <p className="text-gray-500">No properties yet.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <div key={p._id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
          <p className="text-sm text-gray-500">{p.address.city}, {p.address.state}</p>
          <p className="text-sm text-gray-600">₹{p.rentAmount}/month</p>
          <p className="text-sm text-gray-500">Owner: {p.owner?.name} ({p.owner?.email})</p>
          <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {p.available ? 'Available' : 'Not Available'}
          </span>
          <button
            onClick={() => handleDelete(p._id)}
            className="bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600 mt-2"
          >
            Delete Property
          </button>
        </div>
      ))}
    </div>
  )
}

export default AllProperty