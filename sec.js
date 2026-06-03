const http=require('http');
const express=require('express');
const mongoose = require('mongoose');
const eventsRouter=require('./events');
const app=express();

// Middleware to parse form data (needed for POST requests)
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grand Plaza Grocery Management</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Font Awesome for Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @keyframes backgroundShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            body {
                background: linear-gradient(-45deg, #0f172a, #1e1b4b, #2e1065, #0f172a);
                background-size: 400% 400%;
                animation: backgroundShift 15s ease infinite;
            }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center font-sans text-white p-4 overflow-hidden selection:bg-indigo-500 selection:text-white">
        <div class="relative group w-full max-w-lg">
            <!-- Glowing Aura Background -->
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-500 animate-pulse"></div>
            
            <!-- Glassmorphism Container -->
            <div class="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-10 md:p-14 rounded-[2rem] shadow-2xl shadow-black/50 text-center mx-2 sm:mx-0">
                
                <div class="mb-8 md:mb-10">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner animate-pulse">
                        <i class="fas fa-store text-4xl text-indigo-300"></i>
                    </div>
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 leading-tight">
                        <span class="text-white drop-shadow-md">Grand Plaza</span><br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-violet-300">Grocery Management</span>
                    </h1>
                    <p class="text-indigo-200/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mt-4">Select your portal to continue</p>
                </div>

                <div class="flex flex-col gap-5">
                    <!-- Emerald Staff Button -->
                    <a href="/store/staff" class="group/staff relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-600/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 border border-emerald-400/30 hover:border-emerald-200 text-white font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                        <i class="fas fa-user-tie text-emerald-100 group-hover/staff:rotate-12 transition-transform duration-300 text-xl"></i>
                        Staff Portal
                    </a>

                    <!-- Midnight Owner Button -->
                    <a href="/store/owner" class="group/owner relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-indigo-600 hover:to-blue-700 border border-slate-600/50 hover:border-indigo-400 text-white font-bold text-lg shadow-[0_0_15px_rgba(30,41,59,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                        <i class="fas fa-chart-line text-slate-300 group-hover/owner:-translate-y-1 transition-transform duration-300 text-xl"></i>
                        Owner Dashboard
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});



app.use("/store",eventsRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayushshop')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));