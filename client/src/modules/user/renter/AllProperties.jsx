import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'
import AllPropertiesCards from '../AllPropertiesCards'

const AllProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', bedrooms: '' })

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.city) params.city = filters.city
      if (filters.minRent) params.minRent = filters.minRent
      if (filters.maxRent) params.maxRent = filters.maxRent
      if (filters.bedrooms) params.bedrooms = filters.bedrooms

      const res = await axiosInstance.get('/user/properties', { params })
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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="minRent"
          placeholder="Min Rent"
          value={filters.minRent}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="maxRent"
          placeholder="Max Rent"
          value={filters.maxRent}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={filters.bedrooms}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchProperties}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <AllPropertiesCards key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllProperties