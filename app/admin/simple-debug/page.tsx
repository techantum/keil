"use client"

import { useState, useEffect } from "react"

export default function SimpleDebugPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const testFunction = () => {
    try {
      console.log("Test function called")
      setError(null)
    } catch (err) {
      console.error("Error in test function:", err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  if (!mounted) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Debug Page</h1>
      
      <button 
        onClick={testFunction}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Button
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="mt-4">
        <p>Mounted: {mounted ? "Yes" : "No"}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}
