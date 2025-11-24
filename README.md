# Blog App Using Next JS with React JS, Express JS And SUPABASE
- A full-stack blog application built using **Express.js**, **Next JS with React JS**, **Supabase**.  
- It supports **JWT-based authentication** and **Google Single Sign-On (SSO)**.

## Features
- **JWT-based login/signup** with username and password.
- **Google OAuth (SSO)** integration using Passport.js.
- Input validation via **Formik, Yup** for frontend and **Zod** for backend.
- Used app router from **Next JS Routing**.
- Used **Zustand's** persist method for storing auth tokens.
- **Axios** is used for API calls.
- **React Hot Toast** for showing error messages.
- **Helmet.js** for secure HTTP headers.
- **CORS** configured for frontend origin.
- Cookies secured with httpOnly, sameSite, and secure flags.
- Credentials and posts are stored in supabase with Row Level Security enabled.
- Reusable componenets for both create and edit modes.
- Hosted frontend in **Vercel** and backend in **Render**
- Front-end URL: https://fullstack-js-blog.vercel.app/
- Back-end URL: https://fullstack-js-blog.onrender.com/



## Setup Instructions
```bash
git clone https://github.com/akkhileshviswa/express-blog.git
cd fullstack-js-blog/server
npm install
npm start

cd fullstack-js-blog/client
npm install
npm run dev
```
