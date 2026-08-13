async function testProductCreation() {
  const testProduct = {
    name: "API Test Product",
    description: "This is a test product created via API to verify the fix",
    casNumber: "987-65-4",
    category: "Analgesics",
    molecularFormula: "C10H12O",
    molecularWeight: "148.2",
    inStock: true
  }

  try {
    const response = await fetch("http://localhost:8142/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Note: In a real test, you'd need proper authentication
      },
      body: JSON.stringify(testProduct)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log("✅ Product creation successful!")
      console.log("Created product:", JSON.stringify(result, null, 2))
    } else {
      console.log("⚠️ API returned error (likely authentication):", result)
      console.log("Status:", response.status)
    }
  } catch (error) {
    console.error("❌ Request failed:", error)
  }
}

testProductCreation()
