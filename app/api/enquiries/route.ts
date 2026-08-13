import { NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { sendEnquiryAutoReply, sendAdminNotification } from "@/lib/services/email-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const repository = getRepository()
    
    // Clean up empty message field - convert empty strings to undefined
    if (body.message && body.message.trim() === '') {
      body.message = undefined
    }
    
    // Create enquiry in database
    const enquiry = await repository.createEnquiry(body)
    
    // Send auto-reply email to customer (don't wait for it)
    sendEnquiryAutoReply({
      email: body.email,
      name: body.name,
      type: body.type,
      productName: body.productName,
      casNumber: body.casNumber,
      message: body.message,
    }).catch(error => {
      console.error('Failed to send auto-reply email:', error)
    })

    // Send notification email to admin (don't wait for it)
    sendAdminNotification({
      email: body.email,
      name: body.name,
      type: body.type,
      productName: body.productName,
      casNumber: body.casNumber,
      message: body.message,
      phone: body.phone,
      company: body.company,
    }).catch(error => {
      console.error('Failed to send admin notification email:', error)
    })

    return NextResponse.json(enquiry, { status: 201 })
  } catch (error) {
    console.error("Failed to create enquiry:", error)
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
