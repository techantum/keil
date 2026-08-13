"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DebugPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <Button onClick={() => setOpen(true)}>
        Test Dialog
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>This is a test dialog to check if the dialog component works.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
