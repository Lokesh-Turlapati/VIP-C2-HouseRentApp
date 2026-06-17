 
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          House Rent App
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Find your perfect rental property or list yours today.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home