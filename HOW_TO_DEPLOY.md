# Step-by-Step Deployment Guide (For Sir's Laptop)

Agar sir chahte hain ki saare accounts (MongoDB, Cloudinary, Vercel, Render) unke khud ke hon, toh aapko code me koi logic change nahi karna hai. Bas neeche diye gaye steps follow karke keys aur URLs badalne hain:

---

## 1. Cloudinary Setup (For Images)
Sir ko apne account se [Cloudinary](https://cloudinary.com/) par sign up karna hoga.
1. Dashboard par unhe 3 cheezein milengi:
   - Cloud Name
   - API Key
   - API Secret
2. **Kahan change karein:**
   Code ke root folder me rakhi `.env` file open karein aur in 3 lines ko sir ki nayi keys se replace karein:
   ```env
   CLOUDINARY_CLOUD_NAME=sir_ka_cloud_name
   CLOUDINARY_API_KEY=sir_ki_api_key
   CLOUDINARY_API_SECRET=sir_ka_api_secret
   ```

---

## 2. MongoDB Setup (For Database)
Sir ko [MongoDB Atlas](https://www.mongodb.com/) par account banakar ek naya cluster (database) create karna hoga.
1. Cluster banne ke baad `Connect` -> `Drivers` par click karne se ek **Connection String** (Mongo URI) milegi.
2. **Kahan change karein:**
   Code ki `.env` file me `MONGO_URI` ke aage is nayi link ko daal dein:
   ```env
   MONGO_URI=mongodb+srv://sir_username:password@cluster...
   ```
   *(Note: Link me `<password>` ki jagah sir ko apna database password daalna hoga).*

---

## 3. GitHub Upload
Code ko live karne ke liye sabse pehle ise GitHub par daalna hoga.
1. Sir ke laptop par [GitHub](https://github.com/) account login karein.
2. Ek nayi "Repository" banayein.
3. Apna pura code (bina `node_modules` ke) us repository me upload/push kar dein.

---

## 4. Backend Deployment (Render)
Backend ko live karne ke liye hum [Render](https://render.com/) use karenge.
1. Render par GitHub se login karein.
2. **"New Web Service"** par click karke GitHub wali repository select karein.
3. **Settings bharein:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. **Environment Variables:** Wahan `.env` wale saare variables (Jaise `MONGO_URI`, `JWT_SECRET`, aur `CLOUDINARY` wali 3 keys) add kar dein.
5. "Deploy" par click karein.
6. Render thodi der me ek Live URL dega (Jaise: `https://drdo-backend.onrender.com`). Is URL ko copy kar lein.

---

## 5. Frontend Deployment (Vercel)
Website ka UI (Frontend) live karne ke liye [Vercel](https://vercel.com/) sabse best hai.
1. Vercel par GitHub se login karein aur **"Add New Project"** par click karein.
2. Wahi same GitHub repository select karein.
3. **Settings bharein:**
   - Framework Preset: `Vite`
4. **Environment Variables:** Yahan par ek variable add karein:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://drdo-backend.onrender.com/api` *(Yeh Render se copy kiya hua URL hai, aage `/api` lagana zaroori hai)*.
5. "Deploy" par click karein.
6. Vercel aapko final Live Website ka URL de dega (Jaise: `https://sir-ki-website.vercel.app`).

---

## 6. Final Step (CORS Fix)
Jab Vercel ka final URL mil jaye, toh backend ko batana padta hai ki yeh website safe hai.
1. Wapas Render ke Dashboard par jayein.
2. Environment Variables me ek naya variable add karein:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://sir-ki-website.vercel.app` *(Vercel wala URL)*
3. Render ko Save and Redeploy kar dein.

**Badaai ho! Aapka project puri tarah se Sir ke accounts par Live ho chuka hai! 🚀**
