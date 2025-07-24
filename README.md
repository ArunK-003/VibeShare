
# 🎵 Music Sharing Web App

A collaborative music sharing platform where users can join or create rooms, upload their favorite songs, and enjoy a shared listening experience. Built with React, Vite, and Supabase.

---

## ✨ Features

- 🔐 **Authentication:** Signup/Login with Supabase Auth
- 🎵 **Music Rooms:** Users can create or join music rooms
- 🔁 **Round-Robin Play:** Songs uploaded by users play in a rotating order
- ⬆️ **Song Upload:** Upload songs directly to Supabase storage
- 🧑‍💼 **Admin Controls:**
  - View all songs uploaded by all users
  - Set song upload limits per user
  - Delete any song from the room

---

## 🚀 Tech Stack

| Technology     | Purpose                        |
|----------------|--------------------------------|
| React          | Frontend UI library            |
| Vite           | Fast build tool for development |
| Supabase       | Backend: Auth, Database, Storage |
| React Router   | Routing (Login, Signup, Room)  |
| Lucide React   | Icon Library                   |
| ESLint         | Code Linting                   |

---

## 🗂️ Folder Structure

```
project/
│
├── public/                # Static files
├── src/
│   ├── components/        # UI Components (buttons, inputs, etc.)
│   ├── pages/             # Route pages (Login, Signup, CreateRoom, etc.)
│   ├── App.tsx            # Root App Component
│   ├── main.tsx           # Entry point
│   └── supabaseClient.ts  # Supabase config file
├── .env.example           # Example environment file
├── vite.config.ts         # Vite configuration
└── package.json           # Project metadata & scripts
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/music-sharing-app.git
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

Create a `.env` file in the root of the `project/` folder:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

(Do **not** commit this file to GitHub)

---

## 💻 Running the Project

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📦 Building for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

---

## 🌐 Deployment on Vercel

### Set These in Vercel → Project → Settings → Environment Variables:

| Key                    | Value                      |
|------------------------|----------------------------|
| VITE_SUPABASE_URL      | Your Supabase URL          |
| VITE_SUPABASE_ANON_KEY | Your Supabase Anon Key     |

### Vercel Settings:

| Setting           | Value          |
|-------------------|----------------|
| Framework         | Vite           |
| Root Directory    | `project`      |
| Build Command     | `npm run build`|
| Output Directory  | `dist`         |
| Install Command   | `npm install`  |

---

## 🧪 Testing

- Make sure to test login, room creation, and song upload after deploying.
- Check Supabase dashboard for uploaded files.

---

## 📜 License

This project is free to use under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🤝 Contributions

Feel free to fork the repo and submit pull requests! For major changes, open an issue first.

---

## 🙋‍♂️ Author

**Arun K** — [Portfolio](https://your-portfolio-link.com) | [LinkedIn](https://linkedin.com/in/yourprofile)

---
