# 🔗 InfoTree – Your Personalized Link Manager

**InfoTree** is a secure, customizable Linktree clone that allows users to create, manage, and share a single link containing all their important URLs — like social media profiles, project links, portfolio, and more.

---

## ✨ Features

- 🌐 Public user pages at `/users/[username]`
- 🔐 Secure password-protected editing
- 📝 Create, edit, and delete links dynamically
- 📸 Add profile image, handle name, and description
- 🧾 Password confirmation on first creation
- 👁️ Clean InfoTree UI for viewing
- 📋 Copyable shareable links after creation/edit
- ⚡ Fast, local-first experience with MongoDB backend

---

## 👨‍💻 How It Works (User Guide)

### ▶️ On Home Page

1. **Choose "Create InfoTree"** or **"Visit InfoTree"**
2. Enter your desired username.

### 🔧 If Creating a New InfoTree:

- If username is **not taken**, you can:
  - Enter your profile image, name, description
  - Add multiple links (`originalURL + keyword`)
  - Set and confirm a **password**
  - **NOTE: You can't chnage the password, so don't forget it !**
  - Click “Generate InfoTree”
  - Copy and share your public link!

### 🔐 If Username Already Exists:

- You'll get two options:
  - 🔁 **Choose another**
  - 🔐 **It's mine** → enter password
- If correct → you're redirected to **edit mode**
- You can now update info, add/remove links and **Save Changes**
- Link auto-copies and redirects to public InfoTree

---

## 🛠 Tech Stack

| Tool / Library   | Purpose                         |
|------------------|----------------------------------|
| **Next.js (App Router)** | Frontend + Routing          |
| **MongoDB**      | Data storage (local for now)     |
| **Tailwind CSS** | Styling                          |
| **Crypto (Node.js)** | SHA-256 Password Hashing     |
