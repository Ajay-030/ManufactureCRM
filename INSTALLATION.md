# Installation Guide

Follow these step-by-step instructions to set up and run **ManufactureCRM** on your local machine.

---

## Step 1: Install Node.js
Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed.
- Check version: `node -v`

## Step 2: Clone the Project
```bash
git clone <repository-url>
cd ManufactureCRM
```

## Step 3: Install Frontend Dependencies
```bash
cd client
npm install
```

## Step 4: Install Backend Dependencies
```bash
cd ../server
npm install
```

## Step 5: Configure Environment Variables
Create a `.env` file in the `/server` directory (an active `.env` has already been pre-created for your convenience with default settings):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/manufacturecrm
JWT_SECRET=super_secret_jwt_sign_key_for_manufacture_crm_123!
```

## Step 6: Run the Backend Server
Start the Express server using:
```bash
# inside /server directory
npm start
```
*Note: Make sure your local MongoDB instance is running, or configure `MONGO_URI` to point to a cloud MongoDB Atlas instance.*

## Step 7: Run the Frontend Client
Open a new terminal window:
```bash
cd client
npm run dev
```

## Step 8: Access the Application
Open your browser and navigate to:
**[http://localhost:5173](http://localhost:5173)**

---

### Demo Credentials
Log in instantly using the pre-seeded team credentials:
- **Email:** `rajesh@manufacture.com`
- **Password:** `password123`
