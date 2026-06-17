import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'

const AllUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/owners/${id}/approve`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve')
    }
  }

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/admin/owners/${id}/reject`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      await axiosInstance.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Role</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role}</td>
              <td className="px-4 py-3">
                {u.role === 'owner' ? (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {u.isApproved ? 'Approved' : 'Pending'}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 flex gap-2">
                {u.role === 'owner' && !u.isApproved && (
                  <button
                    onClick={() => handleApprove(u._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {u.role === 'owner' && u.isApproved && (
                  <button
                    onClick={() => handleReject(u._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600"
                  >
                    Revoke
                  </button>
                )}
                {u.role !== 'admin' && (
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AllUsers