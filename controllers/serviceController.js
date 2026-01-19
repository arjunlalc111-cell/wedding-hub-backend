//
// Service controller for Wedding Hub (PRODUCTION-READY, ES6, FULL CRUD)
// Handles: add/edit/delete/list services for vendors via JWT from req.vendorId
// Also supports global search/filter, public/private lists, single service get
//

import Service from "../models/Service.js";

// List all services, with optional filters (name, category, vendor) -- public/global
export async function listServices(req, res) {
  try {
    const { name, category, vendor } = req.query;
    const filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (category) filter.category = new RegExp(category, "i");
    if (vendor) filter.vendor = vendor;

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json(services);
  } catch (err) {
    console.error("listServices error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Add service (POST /api/services) -- vendor JWT
export async function createService(req, res) {
  try {
    const vendorId = req.vendorId || req.body.vendor; // from JWT or req.body
    const { name, description, category, price, images } = req.body;

    if (!vendorId || !name)
      return res.status(400).json({ message: "Vendor and name are required." });

    const service = await Service.create({
      vendor: vendorId,
      name: name.trim(),
      description: description ? description.trim() : "",
      category: category ? category.trim() : "",
      price: price !== undefined ? Number(price) : undefined,
      images: images || [],
    });

    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    console.error("createService error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get a single service by id (GET /api/services/:id)
export async function getService(req, res) {
  try {
    const id = req.params.id;
    const service = await Service.findById(id).lean();
    if (!service)
      return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error("getService error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update service (PUT /api/services/:id) -- vendor JWT
export async function updateService(req, res) {
  try {
    const vendorId = req.vendorId;
    const { id } = req.params;
    const update = req.body || {};
    // Only update if vendor owns it
    const service = await Service.findOneAndUpdate(
      { _id: id, vendor: vendorId },
      update,
      { new: true }
    ).lean();
    if (!service)
      return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service updated", service });
  } catch (err) {
    console.error("updateService error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete service (DELETE /api/services/:id) -- vendor JWT
export async function deleteService(req, res) {
  try {
    const vendorId = req.vendorId;
    const { id } = req.params;
    const service = await Service.findOneAndDelete({ _id: id, vendor: vendorId });
    if (!service)
      return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("deleteService error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List services for a specific vendor (GET /api/services/vendor/:vendorId)
export async function listServicesByVendor(req, res) {
  try {
    const vendorId = req.params.vendorId;
    if (!vendorId)
      return res.status(400).json({ message: "vendorId required" });

    const services = await Service.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(services);
  } catch (err) {
    console.error("listServicesByVendor error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List all services for the logged-in vendor (vendor dashboard)
export async function listVendorServices(req, res) {
  try {
    const vendorId = req.vendorId; // from JWT middleware
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    const services = await Service.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(services);
  } catch (err) {
    console.error("listVendorServices error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {  };
