import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('Hello from Chrome Extension!')

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Vibe Extension
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
          onClick={() => setMessage('Spreading good vibes!')}
        >
          Activate Good Vibes
        </button>
      </div>
    </div>
  )
}

export default App