# PPID Kabupaten Sorong - Admin Access Guide

## 🔐 **CMS Admin Access Information**

### **Login URL:**
```
http://localhost:5173/admin/login
```

### **Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@sorongkab.go.id`
- **Role:** Administrator PPID Kabupaten Sorong

---

## 📋 **Available Admin Pages:**

### **1. Dashboard**
- **URL:** `http://localhost:5173/admin`
- **Description:** Overview statistik dan dashboard utama

### **2. Pengaturan** 
- **URL:** `http://localhost:5173/admin/pengaturan`
- **Description:** Pengaturan website, hero section, kontak

### **3. Berita Management**
- **URL:** `http://localhost:5173/admin/berita`
- **Description:** CRUD berita dan artikel

### **4. Informasi Publik Management**
- **URL:** `http://localhost:5173/admin/informasi-publik`
- **Description:** CRUD dokumen informasi publik (berkala, serta merta, dll)

### **5. FAQ Management**
- **URL:** `http://localhost:5173/admin/faq`
- **Description:** CRUD Frequently Asked Questions

### **6. Galeri Management**
- **URL:** `http://localhost:5173/admin/galeri`
- **Description:** CRUD galeri foto dan media

### **7. Permohonan Management**
- **URL:** `http://localhost:5173/admin/permohonan`
- **Description:** Kelola permohonan informasi publik dari masyarakat

---

## 🚀 **Quick Access:**

### **Start Application:**
```bash
cd /Users/akazaya/project/ppid-kabsor
./restart_server.sh
```

### **Direct Admin Login:**
1. Buka browser ke: http://localhost:5173/admin/login
2. Masukkan credentials:
   - Username: `admin`
   - Password: `admin123`
3. Klik "Login"
4. Akan redirect ke dashboard admin

### **API Documentation:**
- **Backend API Docs:** http://localhost:8891/docs
- **Database Management:** PostgreSQL via pgAdmin atau psql

---

## 🔧 **Admin Features:**

- ✅ **User Authentication** (JWT-based)
- ✅ **Role-based Access Control** 
- ✅ **Content Management** (CRUD operations)
- ✅ **File Upload** (documents, images)
- ✅ **Dashboard Analytics**
- ✅ **Settings Management**

---

## 📱 **Admin Interface:**

- **Responsive Design** - Works on desktop, tablet, mobile
- **Modern UI** - Built with React + Tailwind CSS
- **Real-time Updates** - Live data sync
- **File Management** - Upload & organize documents/images

---

## 🔒 **Security Notes:**

- Admin access requires authentication
- JWT tokens for session management
- Protected routes with role validation
- Secure file upload handling
- CORS configured for development

**Important:** Change default admin password in production environment!