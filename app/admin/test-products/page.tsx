"use client"

import { useState } from "react"

export default function TestProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddProduct = () => {
    try {
      console.log("handleAddProduct called")
      setError(null)
      setDialogOpen(true)
    } catch (err) {
      console.error("Error in handleAddProduct:", err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Products Page</h1>
      
      <button 
        onClick={handleAddProduct}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Product (Simple Test)
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {dialogOpen && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Dialog opened successfully! State: {dialogOpen ? "true" : "false"}
        </div>
      )}
    </div>
  )
}
