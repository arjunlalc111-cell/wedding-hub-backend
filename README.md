# Wedding Hub — Backend (Quick Notes)

यह README backend को चलाने और helper script इस्तेमाल करने के लिए छोटा संदर्भ है।

Required environment variables (create `.env` in backend root or set in your host):
- `MONGO_URI` = your_mongo_connection_string
- `JWT_SECRET` = your_jwt_secret
- `ADMIN_SECRET` = optional_admin_secret_for_admin_routes
- `AUTO_APPROVE` = `true` | `false`
- `PORT` = `5000` (optional)
- `CORS_ORIGIN` = your frontend origin (recommended in production)

Install & run:
1. Go to backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Copy example env and edit `.env` with real values:
```bash
cp .env.example .env
# then open .env and fill values
```
4. Start the server:
```bash
npm start
# or for development:
npm run dev
```

Helper script:
- Approve all pending vendors:
  - Ensure `.env` has `MONGO_URI`
  - From backend root run:
```bash
node scripts/approve-all-vendors.js
```

Important files & routes:
- Models:
  - `models/vendors.js`
- Controllers:
  - `controllers/vendorController.js`
  - `controllers/authController.js`
  - `controllers/adminController.js`
  - `controllers/vendorUpdateController.js`
- Routes:
  - `routes/vendorRoutes.js` -> public vendor create/list/get
  - `routes/vendorManageRoutes.js` -> PUT /api/vendors/:id (update; protected)
  - `routes/auth.js` -> auth routes (login / me)
  - `routes/adminRoutes.js` -> admin-only approve/reject/list
- Middleware:
  - `middleware/auth.js` -> `requireAuth` and `requireAdmin`
  - `middleware/upload.js` -> multer upload handling
  - `middleware/errorMiddleware.js` -> centralized error handler

Useful example requests
- Admin login (returns token):
```bash
curl -X POST https://your-backend.example.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<ADMIN_PASSWORD>"}'
```

- Approve vendor (use admin token):
```bash
curl -X POST https://your-backend.example.com/api/admin/vendors/<VENDOR_ID>/approve \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

- Register vendor (multipart form-data):
```bash
curl -X POST https://your-backend.example.com/api/vendors \
  -F "name=Demo Vendor" \
  -F "phone=919812345678" \
  -F "city=Mumbai" \
  -F "services=Photography,Catering" \
  -F "selfie=@/path/to/selfie.jpg" \
  -F "media=@/path/to/photo1.jpg"
```

Notes & recommendations before going live:
- Use S3 (or other object storage) or Cloudinary for file uploads instead of local `/uploads`.
- Set `JWT_SECRET` and `ADMIN_SECRET` to secure random values.
- Restrict `CORS_ORIGIN` to your frontend origin(s) in production.
- Add rate-limiting and request size limits (already partially configured).
- Add input validation (express-validator / Joi).
- Disable `AUTO_APPROVE` in production unless you explicitly want auto-approval.

Optional DevOps helpers (example)
- Simple `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "app.js"]
```

- `Procfile` for platforms that use it:
```
web: node app.js
```

If you want, I can next:
- Provide a ready `scripts/approve-all-vendors.js` file,
- Provide a Postman collection (export) with the main endpoints,
- Provide a full `Dockerfile` + `docker-compose.yml` for local dev (with Mongo service),
- Or update the frontend to use the live API endpoints.

बताइए अब आपको कौन‑सा अतिरिक्त item चाहिए — मैं उसी के साथ आगे का code / steps दे दूँगा।