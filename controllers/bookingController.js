//
// Booking controller for Wedding Hub (Production-Ready)
// Create, list (by vendor/user), update status, get single booking
// Now includes email notification on booking creation!
//

import Booking from "../models/Booking.js";
import Vendor from "../models/vendors.js";
import { sendEmail } from "../utils/emailService.js"; // <-- Email utility

// Create new booking (customer requests vendor service)
export async function createBooking(req, res) {
  try {
    const {
      vendor,
      customerName,
      customerPhone,
      customerEmail,
      eventDate,
      notes,
    } = req.body;

    if (!vendor || !customerName || !customerPhone || !eventDate) {
      return res.status(400).json({
        message: "vendor, customerName, customerPhone, eventDate are required",
      });
    }

    // Check vendor exists
    const venObj = await Vendor.findById(vendor);
    if (!venObj) return res.status(404).json({ message: "Vendor not found" });

    const booking = await Booking.create({
      vendor,
      customerName,
      customerPhone,
      customerEmail,
      eventDate,
      notes,
    });

    // ----------------- Email Notification (customer) -----------------
    if (customerEmail) {
      try {
        await sendEmail({
          to: customerEmail,
          subject: "Your WeddingHub Booking Request Received",
          html: `<h2>Thank you, ${customerName}!</h2>
          <p>Your booking request for <b>${eventDate}</b> is received.<br>Vendor: <b>${venObj.businessName || venObj.name}</b></p>
          <p>We will notify you on status update.</p>`,
        });
      } catch (mailErr) {
        // Log only, booking worked fine
        console.warn("Customer booking email failed:", mailErr.message);
      }
    }
    // ----------------- Email Notification (vendor, optional) -----------------
    if (venObj.email) {
      try {
        await sendEmail({
          to: venObj.email,
          subject: "New Booking Received on WeddingHub",
          html: `<h2>New Booking!</h2>
            <p>Customer: ${customerName} (${customerPhone})<br>
            Event Date: <b>${eventDate}</b><br>
            Notes: ${notes || "N/A"}</p>`,
        });
      } catch (mailErr) {
        console.warn("Vendor booking email failed:", mailErr.message);
      }
    }

    return res.status(201).json({ booking, message: "Booking request created" });
  } catch (err) {
    console.error("createBooking error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List bookings by vendor (for vendor dashboard)
export async function listVendorBookings(req, res) {
  try {
    const vendorId = req.params.vendorId || req.vendorId;
    if (!vendorId) return res.status(400).json({ message: "Vendor id required" });

    const bookings = await Booking.find({ vendor: vendorId })
      .sort({ eventDate: 1 })
      .lean();
    res.json(bookings);
  } catch (err) {
    console.error("listVendorBookings error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List bookings by customer phone (user lookup)
// Example: GET /api/bookings/user/:phone
export async function listUserBookings(req, res) {
  try {
    const phone = req.params.phone;
    if (!phone) return res.status(400).json({ message: "Customer phone required" });

    const bookings = await Booking.find({ customerPhone: phone })
      .sort({ eventDate: 1 })
      .lean();
    res.json(bookings);
  } catch (err) {
    console.error("listUserBookings error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get single booking by id
export async function getBooking(req, res) {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id).lean();
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error("getBooking error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update booking status (approve, reject, cancel) + reason
export async function updateBookingStatus(req, res) {
  try {
    const id = req.params.id;
    const { status, reason } = req.body;
    const allowed = ["Pending", "Approved", "Rejected", "Cancelled"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const updateData = { status };
    if (status === "Rejected") updateData.rejectedReason = reason;
    if (status === "Cancelled") updateData.cancelReason = reason;

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // (Optional) Customer notification on status change
    if (booking.customerEmail) {
      try {
        await sendEmail({
          to: booking.customerEmail,
          subject: `Your Booking Status: ${status}`,
          html: `<h2>Your booking is now <b>${status}</b>.</h2>
          ${reason ? `<p>Reason: ${reason}</p>` : ""}
          <p>Contact us if you need more info.</p>`,
        });
      } catch (mailErr) {
        console.warn("Status update email failed:", mailErr.message);
      }
    }

    res.json({ booking, message: "Booking status updated" });
  } catch (err) {
    console.error("updateBookingStatus error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {  };
