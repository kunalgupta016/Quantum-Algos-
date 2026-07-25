# Step-by-Step Guide: How to Run This Project on Another Computer

Agar aap is project ko kisi dusre computer (PC/Laptop) par chalana chahte hain, toh neeche diye gaye steps ko dhyan se follow karein.

---

## 1. Prerequisites (Zaroori Software)
Naye computer me yeh 2 software install hone chahiye:
1. **Node.js**: [Download here](https://nodejs.org/) (LTS version install karein).
2. **VS Code** (Ya koi aur Code Editor): [Download here](https://code.visualstudio.com/).
3. **Python**: Quantum circuits aur AI scripts run karne ke liye Python 3+ install hona zaroori hai.

---

## 2. Project Setup
1. Maine jo **`QuantumLab_DRDO.zip`** file create ki hai, use naye computer me bhej dein (via PenDrive / Google Drive).
2. Naye computer me us `.zip` file ko **Extract** (unzip) kar lein.
3. Extracted folder ko **VS Code** me open karein.

---

## 3. Environment Variables (.env File)
Jab aap zip file extract karenge, toh hidden files (jaise `.env`) extract ho jayengi. Fir bhi aap check kar lena ki root folder me `.env` file mojood ho.
Isme database aur API keys hoti hain:

```env
MONGO_URI=mongodb+srv://... (Aapki DB link)
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PYTHON_PATH=python

# Cloudinary (Images ke liye)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Google OAuth (Login ke liye)
GOOGLE_CLIENT_ID=...
VITE_GOOGLE_CLIENT_ID=...

# GNews API (News ke liye)
GNEWS_API_KEY=...
```
*(Aap chahein toh apni purani `.env` file ko seedha naye PC me copy-paste kar sakte hain).*

---

## 4. Install Dependencies
Kyunki humne `.zip` file ka size chota rakhne ke liye `node_modules` folder ko hata diya tha, isliye aapko naye PC par packages install karne honge.

**Backend Setup:**
1. VS Code me Terminal open karein (`Ctrl + ~`).
2. Backend folder me jayein aur install karein:
   ```bash
   cd backend
   npm install
   ```

**Frontend Setup:**
1. Ek aur naya Terminal open karein (VS Code me terminal panel ke top right me `+` icon par click karein).
2. Root folder (main folder) me reh kar run karein:
   ```bash
   npm install
   ```

---

## 5. Run the Project
Project ko chalane ke liye dono terminals me command run karni padegi.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*(Backend `http://localhost:8000` par start ho jayega)*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*(Frontend `http://localhost:5173` par start ho jayega)*

Ab aap apne naye computer ke browser me **`http://localhost:5173`** open karke puri website aur Admin Panel use kar sakte hain! 🚀

---

## (Optional) Online Deploy Karne Ke Steps (Vercel/Render)
Agar aap isko kisi aur PC par local chalane ke bajaye internet par (live) deploy karna chahte hain, toh ye steps use karein:
1. Apna pura code **GitHub** par upload (push) karein.
2. Backend ko **Render.com** par deploy karein. Waha Environment Variables (`.env` wale) configure karein. Start command me `node server.js` likhein.
3. Frontend ko **Vercel.com** par deploy karein. Framework me `Vite` select karein aur Environment Variables me `VITE_API_BASE_URL` add karein jiski value Render ka URL ho + `/api` (Jaise: `https://xyz.onrender.com/api`).
4. Jab Vercel ka URL mil jaye, toh usko wapas Render me `FRONTEND_URL` naam se add kar dein taaki CORS block na kare.
