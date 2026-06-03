const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, 'products.json');
const categoriesFile = path.join(__dirname, 'categories.json');

let dbProducts = [];
let dbCategories = [];

function loadData() {
    if (fs.existsSync(productsFile)) {
        try { dbProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8')); } catch (err) {}
    }
    if (fs.existsSync(categoriesFile)) {
        try { dbCategories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8')); } catch (err) {}
    }
}
function saveData() {
    fs.writeFileSync(productsFile, JSON.stringify(dbProducts, null, 2));
    fs.writeFileSync(categoriesFile, JSON.stringify(dbCategories, null, 2));
}
loadData();

// Seed initial data if DB is empty
function seedDatabase() {
    if (dbProducts.length === 0) {
        dbProducts = [
            { id: 1, name: 'Fresh Apples (1kg)', category: 'Fruits & Veggies', brand: 'Farm Fresh', buyingPrice: 120, price: 150, stock: 100, arrivalDate: '2026-06-01' },
            { id: 2, name: 'Whole Milk (1L)', category: 'Dairy', brand: 'Amul', buyingPrice: 50, price: 65, stock: 50, arrivalDate: '2026-06-02' },
            { id: 3, name: 'Whole Wheat Bread', category: 'Bakery', brand: 'Britannia', buyingPrice: 35, price: 45, stock: 40, arrivalDate: '2026-06-03' }
        ];
        saveData();
    }
    if (dbCategories.length === 0) {
        const initialCategories = ['Fruits & Veggies', 'Dairy', 'Bakery', 'Atta, Rice & Dals', 'Drinks', 'Household'];
        dbCategories = initialCategories.map(name => ({ name }));
        saveData();
    }
}
seedDatabase();

// Path to the JSON file for storing orders
const ordersFile = path.join(__dirname, 'orders.json');

function getOrders() {
    if (fs.existsSync(ordersFile)) {
        try {
            return JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        } catch (err) {
            console.error("Error reading orders file");
        }
    }
    return [];
}

// Store credentials in a variable so they can be updated dynamically
let credentials = {
    staff: 'staff123',
    owner: 'owner123'
};

// Galaxy Starfield Generator (Global scope so both dashboards can use it)
const generateStars = (n) => {
    let value = '';
    for (let i = 0; i < n; i++) {
        value += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF${i === n - 1 ? '' : ', '}`;
    }
    return value;
};
const starsSmall = generateStars(700);
const starsMedium = generateStars(200);
const starsLarge = generateStars(100);

// --- HTTP Basic Authentication Middlewares ---
const staffAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, pwd] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === 'staff' && pwd === credentials.staff) return next();
    
    res.set('WWW-Authenticate', 'Basic realm="Staff Portal"');
    res.status(401).send('Authentication required for Staff Portal.');
};

const ownerAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, pwd] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === 'owner' && pwd === credentials.owner) return next();
    
    res.set('WWW-Authenticate', 'Basic realm="Owner Dashboard"');
    res.status(401).send('Authentication required for Owner Dashboard.');
};

// Helper for HTML with Styles (Live Background & Animations)
const renderPage = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajay Enterprises Management</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-dark: #0F172A;
            --card-bg: transparent;
            --border-color: rgba(255, 255, 255, 0.2);
            --text-light: #E2E8F0;
            --text-muted: #94A3B8;
            --accent-green: #10B981;
            --accent-red: #EF4444;
            --accent-purple: #6366F1;
            --accent-teal: #14B8A6;
        }
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #050510;
            color: var(--text-light);
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        /* Live Galaxy Background */
        .galaxy-bg {
            position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
            background: linear-gradient(to bottom, #050510, #1a0b2e, #050510);
        }
        .content-wrapper { position: relative; z-index: 10; }
        
        #stars { width: 1px; height: 1px; background: transparent; box-shadow: ${starsSmall}; animation: animStar 50s linear infinite; }
        #stars::after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; background: transparent; box-shadow: ${starsSmall}; }
        #stars2 { width: 2px; height: 2px; background: transparent; box-shadow: ${starsMedium}; animation: animStar 100s linear infinite; }
        #stars2::after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; background: transparent; box-shadow: ${starsMedium}; }
        #stars3 { width: 3px; height: 3px; background: transparent; box-shadow: ${starsLarge}; animation: animStar 150s linear infinite; }
        #stars3::after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; background: transparent; box-shadow: ${starsLarge}; }
        
        @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
        
        /* Planets */
        .planet { position: absolute; border-radius: 50%; box-shadow: inset -25px -25px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255,255,255,0.05); z-index: 0; }
        .planet-1 { width: 180px; height: 180px; top: 15%; right: 8%; background: radial-gradient(circle at 30% 30%, #6366f1, #1e1b4b); animation: float 25s ease-in-out infinite alternate; }
        .planet-2 { width: 100px; height: 100px; bottom: 10%; left: 8%; background: radial-gradient(circle at 30% 30%, #10b981, #064e3b); animation: float 30s ease-in-out infinite alternate-reverse; }
        .planet-2::after { content: ''; position: absolute; top: 50%; left: 50%; width: 160px; height: 30px; border: 6px solid rgba(16, 185, 129, 0.4); border-radius: 50%; transform: translate(-50%, -50%) rotate(-20deg); box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
        .planet-3 { width: 50px; height: 50px; top: 35%; left: 15%; background: radial-gradient(circle at 30% 30%, #fbbf24, #78350f); animation: float 15s ease-in-out infinite alternate; }
        
        /* Asteroids */
        .asteroid { position: absolute; background: #64748b; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5); animation: spinAndMove 30s linear infinite; z-index: 0; }
        .asteroid-1 { width: 35px; height: 25px; top: 10%; right: -10%; animation-duration: 35s; }
        .asteroid-2 { width: 20px; height: 25px; top: 30%; right: -20%; animation-duration: 45s; animation-delay: 5s; }
        .asteroid-3 { width: 45px; height: 35px; top: -10%; right: 20%; animation-duration: 50s; animation-delay: 15s; }

        /* Shooting Stars */
        .shooting-star { position: absolute; width: 150px; height: 2px; background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)); animation: shooting 6s linear infinite; opacity: 0; transform: rotate(-45deg); z-index: 1; }
        .shooting-star::after { content: ''; position: absolute; top: -4px; left: 0; width: 10px; height: 10px; background: #fff; border-radius: 50%; box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.8); }

        /* Nebulas */
        .nebula { position: absolute; border-radius: 50%; mix-blend-mode: screen; animation: blob 20s infinite; }
        .nebula-1 { top: 10%; left: 20%; width: 600px; height: 600px; background: rgba(192, 38, 211, 0.2); filter: blur(100px); }
        .nebula-2 { top: 40%; right: 10%; width: 500px; height: 500px; background: rgba(79, 70, 229, 0.2); filter: blur(120px); animation-delay: 2s; }
        .nebula-3 { bottom: -10%; left: 30%; width: 700px; height: 700px; background: rgba(37, 99, 235, 0.2); filter: blur(120px); animation-delay: 4s; }

        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 100% { transform: translateY(-30px) rotate(5deg); } }
        @keyframes spinAndMove { 0% { transform: translate(0, 0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translate(-1500px, 1500px) rotate(720deg); opacity: 0; } }
        @keyframes shooting { 0% { transform: translate(500px, -500px) rotate(-45deg); opacity: 1; } 20% { opacity: 1; } 50% { transform: translate(-1000px, 1000px) rotate(-45deg); opacity: 0; } 100% { transform: translate(-1000px, 1000px) rotate(-45deg); opacity: 0; } }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        }
        
        /* Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes glow {
            from { box-shadow: 0 0 5px var(--glow-color); }
            to { box-shadow: 0 0 20px 5px var(--glow-color); }
        }
        
        /* Main Layout Styles */
        .navbar {
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(12px);
            padding: 1rem 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid var(--border-color);
        }
        .nav-left { display: flex; align-items: center; gap: 10px; }
        .navbar h1 { margin: 0; font-size: 1.5rem; color: white; }
        .live-dot { height: 10px; width: 10px; background-color: var(--accent-green); border-radius: 50%; display: inline-block; }
        
        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-right .nav-link { color: var(--text-muted); text-decoration: none; font-weight: 500; transition: color 0.3s; }
        .nav-right .nav-link:hover { color: white; }
        .nav-icon { color: var(--text-light); font-size: 1.2rem; position: relative; }
        .notification-pulse {
            position: absolute; top: 0; right: 0;
            width: 8px; height: 8px;
            background-color: var(--accent-red);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        .main-content { 
            width: 100%; 
            max-width: 1400px; 
            margin: 0 auto;
            padding: 40px 20px;
            box-sizing: border-box;
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            opacity: 0;
            animation: slideUp 0.6s ease-out;
            animation-fill-mode: forwards;
        }
        .card:hover { 
            transform: translateY(-5px);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }
        h1, h2, h3 { color: white; margin-top: 0; }
        button {
            background: var(--accent-purple);
            color: white; border: none;
            padding: 12px 24px; border-radius: 25px; cursor: pointer;
            font-weight: bold; transition: all 0.3s ease;
            transform: scale(1);
        }
        button:hover { 
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .btn-secondary { background-color: var(--accent-teal); }
        .btn-secondary:hover { box-shadow: 0 0 20px rgba(20, 184, 166, 0.4); }
        .btn-danger { background-color: var(--accent-red); }
        .btn-danger:hover { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
        
        input, select {
            width: 100%; padding: 12px; margin: 8px 0;
            box-sizing: border-box; 
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border-color); 
            border-radius: 8px;
            color: var(--text-light);
            font-size: 1rem;
        }
        input::placeholder { color: var(--text-muted); }
        input:focus, select:focus {
            outline: none;
            border-color: var(--accent-purple);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
        }
        a { text-decoration: none; color: inherit; }

        /* Search and Grid Styles */
        .search-box {
            display: flex;
            align-items: center;
            background: transparent;
            border: 1px solid var(--border-color);
            border-radius: 25px;
            padding: 5px 15px;
            margin-bottom: 25px;
            transition: all 0.3s ease;
        }
        .search-box:focus-within {
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
            border-color: var(--accent-purple);
        }
        .search-box input {
            border: none; background: transparent; outline: none;
            flex: 1; padding: 10px; font-size: 1rem; color: white;
        }
        .search-box i { color: var(--text-muted); font-size: 1.2em; margin-right: 10px; }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .product-card-owner h3 { color: var(--text-light); }
        
        /* Accordion / Collapsible Styles */
        .section-header {
            cursor: pointer; display: flex; justify-content: space-between; align-items: center;
            background: transparent; padding: 12px 20px;
            border-radius: 8px; color: white; margin-top: 20px; font-size: 1.3em;
            border: 1px solid var(--border-color); transition: background 0.3s;
        }
        .section-header:hover { background: rgba(255, 255, 255, 0.1); }
        .section-header .fa-chevron-down { transition: transform 0.3s ease; }
        .section-header.active .fa-chevron-down { transform: rotate(180deg); }

        .section-content {
            display: grid;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .section-content.active {
            max-height: 2000px; /* Adjust as needed */
            margin-top: 15px;
        }

        /* Ticket Styles */
        .ticket-wrapper {
            margin: 20px auto;
            max-width: 750px;
            perspective: 1000px;
        }
        .ticket {
            display: flex;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.2);
            overflow: hidden;
            animation: flipIn 0.8s ease-out;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .ticket:hover { transform: translateY(-5px); box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
        @keyframes flipIn {
            from { transform: rotateX(30deg) opacity(0); }
            to { transform: rotateX(0) opacity(1); }
        }
        .ticket-main {
            flex: 1;
            padding: 30px;
            border-right: 2px dashed #ccc;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .ticket-stub {
            width: 200px;
            padding: 20px;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .event-title { font-size: 2em; font-weight: 800; color: #2c3e50; margin: 0; line-height: 1.1; text-transform: uppercase; }
        .event-meta { color: #7f8c8d; font-size: 0.85em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .ticket-details {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
        }
        .detail-group { display: flex; flex-direction: column; }
        .detail-label { font-size: 0.7em; color: #95a5a6; text-transform: uppercase; font-weight: 600; }
        .detail-value { font-size: 1.1em; font-weight: 700; color: #34495e; }
        .ticket-stub img { width: 130px; height: 130px; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 8px; }
        .stub-id { margin-top: 10px; font-family: 'Courier New', monospace; font-size: 0.85em; color: #7f8c8d; word-break: break-all; }        

        /* New Dashboard Structure */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .kpi-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.3s ease;
            animation: slideUp 0.6s ease-out forwards;
        }
        .kpi-card.alert { animation: glow 1.5s infinite alternate; }
        .kpi-card:hover { transform: translateY(-5px); border-color: var(--accent-purple); }
        .kpi-title { font-size: 1rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
        .kpi-value { font-size: 2.5rem; font-weight: 700; color: white; }
        .kpi-trend { font-size: 0.9rem; color: var(--accent-green); }
        .kpi-card:nth-child(1) { animation-delay: 0.1s; }
        .kpi-card:nth-child(2) { animation-delay: 0.2s; }
        .kpi-card:nth-child(3) { animation-delay: 0.3s; }
        .kpi-card:nth-child(4) { animation-delay: 0.4s; }
        
        .workspace-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        .inventory-panel, .actions-hub { animation: slideUp 0.8s ease-out forwards; }
        .inventory-panel { animation-delay: 0.5s; }
        .actions-hub { animation-delay: 0.7s; }

        .quick-actions { display: flex; gap: 15px; margin-bottom: 30px; }
        .quick-actions button { flex: 1; }

        .live-orders .ticket {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            color: var(--text-light);
            animation: none;
        }
        .live-orders .ticket-main { border-right: 2px dashed var(--border-color); }
        .live-orders .event-title { color: white; }
        .live-orders .event-meta { color: var(--text-muted); }
        .live-orders .detail-label { color: var(--text-muted); }
        .live-orders .detail-value { color: var(--text-light); }
        .live-orders .ticket-stub { display: none; } /* Hiding stub for a cleaner list */
        
        /* Mobile Responsive Adjustments */
        @media (max-width: 992px) {
            .workspace-grid { grid-template-columns: 1fr; gap: 20px; }
        }
        @media (max-width: 768px) {
            .navbar { flex-direction: column; gap: 15px; padding: 1rem; text-align: center; }
            .nav-right { flex-wrap: wrap; justify-content: center; }
            .main-content { padding: 20px 10px; }
            .card { padding: 15px; }
            .kpi-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
        }
        @media (max-width: 480px) {
            .quick-actions { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body>
    <!-- Live Galaxy Background -->
    <div class="galaxy-bg">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        
        <div class="planet planet-1"></div>
        <div class="planet planet-2"></div>
        <div class="planet planet-3"></div>
        
        <div class="asteroid asteroid-1"></div>
        <div class="asteroid asteroid-2"></div>
        <div class="asteroid asteroid-3"></div>

        <div class="shooting-star" style="top: 20%; right: 10%; animation-delay: 0s;"></div>
        <div class="shooting-star" style="top: 50%; right: -10%; animation-delay: 3s;"></div>
        <div class="shooting-star" style="top: -10%; right: 40%; animation-delay: 7s;"></div>

        <div class="nebula nebula-1"></div>
        <div class="nebula nebula-2"></div>
        <div class="nebula nebula-3"></div>
    </div>
    
    <div class="content-wrapper">
        <nav class="navbar">
            <div class="nav-left">
                <h1><span class="live-dot"></span> Ajay Enterprises</h1>
            </div>
            <div class="nav-right">
                <a href="#" class="nav-icon"><i class="fas fa-bell"></i><span class="notification-pulse"></span></a>
                <a href="#" class="nav-icon"><i class="fas fa-user-circle"></i></a>
                <a href="/store/owner" class="nav-link">Dashboard</a>
                <a href="/store/staff" class="nav-link">Staff</a>
                <a href="/" class="nav-link">Home</a>
            </div>
        </nav>
        <main class="main-content">
            ${content}
        </main>
    </div>
</body>
</html>
`;

// Redirect base store route to staff dashboard
router.get('/', (req, res) => {
    res.redirect('/store/staff');
});

// Staff Dashboard Route
router.get('/staff', staffAuth, async (req, res) => {
    let orders = getOrders();
    const products = dbProducts;
    const categoriesDocs = dbCategories;
    const categories = categoriesDocs.map(c => c.name);

    // Calculate total values
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalBuyingValue = products.reduce((sum, p) => sum + ((p.buyingPrice || 0) * p.stock), 0);
    const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);

    const ordersMap = new Map();
    orders.forEach(o => {
        if (!ordersMap.has(o.orderId)) {
            ordersMap.set(o.orderId, {
                orderId: o.orderId,
                customer: o.customer,
                email: o.email,
                date: o.date,
                items: [],
                totalBill: 0
            });
        }
        const order = ordersMap.get(o.orderId);
        order.items.push(o);
        order.totalBill += parseFloat(o.totalPrice) || 0;
    });

    const uniqueOrders = Array.from(ordersMap.values()).reverse();

    const ordersHtml = uniqueOrders.length > 0 ? uniqueOrders.map(o => `
        <div class="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl mb-3 transition-all hover:bg-white/10 previous-order-card" data-order-id="${o.orderId}" data-customer="${(o.customer || '').replace(/"/g, '&quot;').toLowerCase()}">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="font-bold text-indigo-300">Order #${o.orderId}</div>
                    <div class="text-xs text-gray-400">${new Date(o.date).toLocaleString('en-IN')}</div>
                </div>
                <div class="text-right">
                    <div class="font-black text-emerald-400">₹${o.totalBill.toLocaleString('en-IN')}</div>
                    <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/30">Completed</span>
                </div>
            </div>
            <div class="text-sm text-gray-300 mb-2"><i class="fas fa-user text-gray-500"></i> ${o.customer}</div>
            <div class="text-xs text-gray-400 space-y-1 mb-3">
                ${o.items.map(item => `
                    <div class="flex justify-between">
                        <span>${item.quantity}x ${item.productName}</span>
                        <span>₹${item.totalPrice}</span>
                    </div>
                `).join('')}
            </div>
            <!-- Action buttons: Print & Delete -->
            <div class="flex gap-2 mt-2 pt-3 border-t border-white/10">
                <a href="/store/bill/${o.orderId}" class="flex-1 block">
                    <button type="button" class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 text-xs font-bold py-1.5 rounded transition-colors flex justify-center items-center gap-1 border border-indigo-500/30">
                        <i class="fas fa-print"></i> Print Bill
                    </button>
                </a>
                <form action="/store/cancel-order" method="POST" class="flex-1 m-0" onsubmit="return confirm('Cancel this order and restore stock?');">
                    <input type="hidden" name="orderId" value="${o.orderId}">
                    <button type="submit" class="w-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-bold py-1.5 rounded transition-colors flex justify-center items-center gap-1 border border-amber-500/30">
                        <i class="fas fa-ban"></i> Cancel
                    </button>
                </form>
                <form action="/store/delete-order" method="POST" class="flex-1 m-0" onsubmit="return confirm('Are you sure you want to delete this order?');">
                    <input type="hidden" name="orderId" value="${o.orderId}">
                    <button type="submit" class="w-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-bold py-1.5 rounded transition-colors flex justify-center items-center gap-1 border border-rose-500/30">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </form>
            </div>
        </div>
    `).join('') : `
        <div class="p-4 text-center text-gray-400 italic">No previous orders found.</div>
    `;

    const previousOrdersSection = `
    <div class="category-section-staff animate-fade-in-up bg-transparent backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-indigo-500/30 overflow-hidden mb-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]">
      <div class="flex justify-between items-center px-4 md:px-6 py-4 cursor-pointer select-none group bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors" onclick="this.nextElementSibling.classList.toggle('open'); const icon = this.querySelector('.fa-chevron-down'); icon.style.transform = icon.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';">
        <h2 class="font-bold text-lg text-white flex items-center gap-3">
            <span class="text-xl text-indigo-300"><i class="fas fa-receipt"></i></span> 
            Previous Orders (Billing History)
        </h2>
        <span class="text-indigo-300 text-sm transition-all duration-300"><i class="fas fa-chevron-down"></i></span>
      </div>
      
      <div class="section-content accordion-content">
        <div>
            <div class="p-4 border-t border-white/10 bg-black/20">
                <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400 group-focus-within:text-indigo-500 transition-colors"></i>
                    </div>
                    <input type="text" id="billSearchInput" onkeyup="searchBills()" placeholder="Search by Order ID or Customer..." 
                           class="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 shadow-inner transition-all text-white font-medium placeholder-gray-500 text-sm">
                </div>
            </div>
            <div class="px-4 pb-4 md:px-6 md:pb-6 bg-black/20 max-h-96 overflow-y-auto" id="previousOrdersList">
              ${ordersHtml}
            </div>
        </div>
      </div>
    </div>
    `;

    const getIconForCategory = (cat) => {
        if (cat === 'Fruits & Veggies') return '🥦';
        if (cat === 'Dairy') return '🥛';
        if (cat === 'Bakery') return '🍞';
        if (cat === 'Atta, Rice & Dals') return '🌾';
        if (cat === 'Drinks') return '🥤';
        if (cat === 'Household') return '🧼';
        return '📦';
    };

    const groupedProductsHtml = categories.map((category, index) => {
        const categoryProducts = products.filter(p => p.category === category);
        const productsHtml = categoryProducts.map(product => {
            const stockColor = product.stock > 20 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : (product.stock < 5 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30');
            return `
        <div class="product-card-staff group relative overflow-hidden bg-transparent backdrop-blur-md border border-white/20 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] hover:border-white/40 hover:bg-white/5" data-name="${product.name.toLowerCase()}" data-brand="${product.brand.toLowerCase()}">
          
          <!-- Hidden Glow Accent -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/0 rounded-full blur-3xl transition-all duration-500 group-hover:bg-indigo-500/40 pointer-events-none"></div>

          <div class="flex justify-between items-start mb-3 relative z-10">
            <h3 class="font-bold text-white text-lg transition-colors duration-300 group-hover:text-indigo-300 pr-2">${product.name}</h3>
            <span class="${stockColor} border text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm backdrop-blur-sm">Stock: ${product.stock}</span>
          </div>
          
          <div class="space-y-1.5 text-sm text-gray-300 mb-5 relative z-10">
            <p class="flex items-center gap-2"><i class="fas fa-industry text-gray-400"></i> <span class="font-medium text-gray-100">${product.brand}</span></p>
            <p class="flex items-center gap-2"><i class="fas fa-calendar-alt text-gray-400"></i> <span class="text-gray-200">Arrival: ${product.arrivalDate || 'N/A'}</span></p>
            <div class="flex items-center gap-2 mt-2">
              <button type="button" onclick="toggleSinglePrice(this)" class="text-[10px] uppercase font-bold tracking-wider bg-transparent text-gray-300 hover:text-white hover:bg-indigo-500/40 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-white/20 backdrop-blur-sm">
                  <i class="fas fa-eye"></i> Buy Price
              </button>
              <span class="buying-price-display hidden text-xs font-bold text-rose-300 bg-rose-500/20 backdrop-blur-sm px-2 py-1 rounded border border-rose-500/30">₹${product.buyingPrice || 0}</span>
            </div>
          </div>
          
          <div class="mt-4 relative z-10">
            <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Sell Price</p>
            <p class="text-2xl font-black text-emerald-400 leading-none">₹${product.price}</p>
          </div>
          
          <div class="flex gap-2 mt-5 relative z-10">
              <a href="/store/stock/${product.id}" class="flex-1 block">
                <button class="w-full bg-transparent backdrop-blur-sm border border-white/20 text-gray-200 font-bold py-2.5 rounded-xl text-sm transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-500/40 hover:text-white hover:shadow-md flex items-center justify-center gap-2">
                    <i class="fas fa-sync-alt transition-transform hover:rotate-180"></i> Stock
                </button>
              </a>
              <button onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, ${product.stock})" class="flex-1 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 font-bold py-2.5 rounded-xl text-sm transition-all duration-300 hover:bg-emerald-500/40 hover:text-white hover:shadow-md flex items-center justify-center gap-2">
                  <i class="fas fa-cart-plus"></i> Add
              </button>
          </div>
        </div>
        `;
        }).join('');

        return `
    <div class="category-section-staff animate-fade-in-up bg-transparent backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/20 overflow-hidden mb-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:border-indigo-400/50 opacity-0" style="animation-delay: ${index * 0.15}s; animation-fill-mode: forwards;" data-category-name="${category.toLowerCase()}">
      
      <!-- Stylish Header -->
      <div class="flex justify-between items-center px-4 md:px-6 py-5 cursor-pointer select-none group transition-colors hover:bg-white/5" onclick="this.nextElementSibling.classList.toggle('open'); const icon = this.querySelector('.fa-chevron-down'); icon.style.transform = icon.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';">
        <h2 class="font-bold text-lg text-white flex items-center gap-4 transition-colors group-hover:text-indigo-300">
            <span class="text-2xl bg-transparent backdrop-blur-md shadow-sm border border-white/20 p-2.5 rounded-xl group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-300">${getIconForCategory(category)}</span> 
            <span class="break-words">${category}</span>
        </h2>
        <span class="text-gray-300 text-sm bg-transparent backdrop-blur-md shadow-sm border border-white/20 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-indigo-500/40 group-hover:text-white group-hover:shadow-md"><i class="fas fa-chevron-down"></i></span>
      </div>
      
      <!-- Animated Accordion Content -->
      <div class="section-content accordion-content">
        <div class="px-6 pb-6 border-t border-white/20 bg-transparent">
          ${productsHtml 
              ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-6">${productsHtml}</div>` 
              : `<div class="p-6 md:p-10 mt-6 text-center bg-transparent backdrop-blur-md rounded-2xl border border-dashed border-white/20 shadow-sm">
                   <div class="flex flex-col items-center justify-center gap-3">
                       <div class="w-16 h-16 bg-transparent rounded-full flex items-center justify-center mb-2 shadow-inner border border-white/20">
                           <i class="fas fa-box-open text-2xl text-gray-400"></i>
                       </div>
                       <span class="text-gray-200 font-bold text-lg tracking-wide">Empty Section</span>
                       <span class="text-gray-400 text-sm font-medium">✨ No products configured here yet.</span>
                   </div>
                 </div>`
          }
        </div>
      </div>
    </div>
        `;
    }).join('');

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Staff Dashboard - Ajay Enterprises</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        .accordion-content {
            display: grid;
            grid-template-rows: 0fr;
            opacity: 0;
            transition: grid-template-rows 0.4s ease-out, opacity 0.4s ease-out;
        }
        .accordion-content.open {
            grid-template-rows: 1fr;
            opacity: 1;
        }
        .accordion-content > div {
            overflow: hidden;
        }
        .animate-blob {
            animation: blob 20s infinite;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Live Galaxy Animation CSS */
        #stars { width: 1px; height: 1px; background: transparent; box-shadow: ${starsSmall}; animation: animStar 50s linear infinite; }
        #stars::after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; background: transparent; box-shadow: ${starsSmall}; }
        
        #stars2 { width: 2px; height: 2px; background: transparent; box-shadow: ${starsMedium}; animation: animStar 100s linear infinite; }
        #stars2::after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; background: transparent; box-shadow: ${starsMedium}; }
        
        #stars3 { width: 3px; height: 3px; background: transparent; box-shadow: ${starsLarge}; animation: animStar 150s linear infinite; }
        #stars3::after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; background: transparent; box-shadow: ${starsLarge}; }
        
        @keyframes animStar {
            from { transform: translateY(0px); }
            to { transform: translateY(-2000px); }
        }

        /* Planets */
        .planet {
            position: absolute;
            border-radius: 50%;
            box-shadow: inset -25px -25px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255,255,255,0.05);
            z-index: 0;
        }
        .planet-1 {
            width: 180px; height: 180px;
            top: 15%; right: 8%;
            background: radial-gradient(circle at 30% 30%, #6366f1, #1e1b4b);
            animation: float 25s ease-in-out infinite alternate;
        }
        .planet-2 {
            width: 100px; height: 100px;
            bottom: 10%; left: 8%;
            background: radial-gradient(circle at 30% 30%, #10b981, #064e3b);
            animation: float 30s ease-in-out infinite alternate-reverse;
        }
        .planet-2::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 160px; height: 30px;
            border: 6px solid rgba(16, 185, 129, 0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%) rotate(-20deg);
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }
        .planet-3 {
            width: 50px; height: 50px;
            top: 35%; left: 15%;
            background: radial-gradient(circle at 30% 30%, #fbbf24, #78350f);
            animation: float 15s ease-in-out infinite alternate;
        }
        
        /* Asteroids */
        .asteroid {
            position: absolute;
            background: #64748b;
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            box-shadow: inset -5px -5px 15px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5);
            animation: spinAndMove 30s linear infinite;
            z-index: 0;
        }
        .asteroid-1 { width: 35px; height: 25px; top: 10%; right: -10%; animation-duration: 35s; }
        .asteroid-2 { width: 20px; height: 25px; top: 30%; right: -20%; animation-duration: 45s; animation-delay: 5s; }
        .asteroid-3 { width: 45px; height: 35px; top: -10%; right: 20%; animation-duration: 50s; animation-delay: 15s; }

        /* Shooting Stars */
        .shooting-star {
            position: absolute;
            width: 150px; height: 2px;
            background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
            animation: shooting 6s linear infinite;
            opacity: 0; transform: rotate(-45deg); z-index: 1;
        }
        .shooting-star::after {
            content: ''; position: absolute; top: -4px; left: 0; width: 10px; height: 10px;
            background: #fff; border-radius: 50%; box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.8);
        }

        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes spinAndMove {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translate(-1500px, 1500px) rotate(720deg); opacity: 0; }
        }
        @keyframes shooting {
            0% { transform: translate(500px, -500px) rotate(-45deg); opacity: 1; }
            20% { opacity: 1; }
            50% { transform: translate(-1000px, 1000px) rotate(-45deg); opacity: 0; }
            100% { transform: translate(-1000px, 1000px) rotate(-45deg); opacity: 0; }
        }

            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        </style>
    </head>
    <body class="bg-[#050510] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white relative min-h-screen overflow-x-hidden">
        
        <!-- Live Galaxy Background -->
        <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#050510] via-[#1a0b2e] to-[#050510]">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            
            <!-- Real Galaxy Objects -->
            <div class="planet planet-1"></div>
            <div class="planet planet-2"></div>
            <div class="planet planet-3"></div>
            
            <div class="asteroid asteroid-1"></div>
            <div class="asteroid asteroid-2"></div>
            <div class="asteroid asteroid-3"></div>

            <div class="shooting-star" style="top: 20%; right: 10%; animation-delay: 0s;"></div>
            <div class="shooting-star" style="top: 50%; right: -10%; animation-delay: 3s;"></div>
            <div class="shooting-star" style="top: -10%; right: 40%; animation-delay: 7s;"></div>

            <!-- Glowing Nebulas -->
            <div class="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div class="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style="animation-delay: 2s;"></div>
            <div class="absolute -bottom-[10%] left-[30%] w-[700px] h-[700px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style="animation-delay: 4s;"></div>
        </div>

        <div class="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
          
          <!-- Glassmorphism Header -->
          <header class="flex flex-col sm:flex-row justify-between items-center bg-transparent backdrop-blur-md p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8 border border-white/20 relative overflow-hidden gap-4 animate-fade-in-up">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
            <h1 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 relative z-10 mb-2 sm:mb-0 text-center">
                <span class="bg-indigo-500/40 text-white p-2 rounded-xl text-xl shadow-md border border-white/20"><i class="fas fa-store"></i></span> 
                Ajay Enterprises
            </h1>
            <div class="flex flex-wrap justify-center items-center gap-3 relative z-10">
              <a href="/store/owner" class="text-sm font-semibold text-gray-300 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-transparent px-3 py-2 rounded-lg border border-white/20 hover:border-indigo-400/50"><i class="fas fa-chart-line"></i> Owner</a>
              <a href="/" class="text-sm font-semibold text-gray-300 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-transparent px-3 py-2 rounded-lg border border-white/20 hover:border-indigo-400/50"><i class="fas fa-home"></i> Home</a>
              <button class="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-indigo-500/20 border border-white/20 rounded-full text-gray-300 hover:text-white transition-all shadow-sm relative">
                <i class="fas fa-bell"></i>
                <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div class="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
              <span class="text-sm font-bold bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl border border-indigo-400/30 shadow-sm flex items-center gap-2">
                <i class="fas fa-user-tag"></i> Staff
              </span>
            </div>
          </header>

          ${previousOrdersSection}

          <!-- New KPI Grid for Staff -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
              <div class="bg-transparent backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform">
                  <h3 class="text-gray-300 font-bold mb-2 flex items-center gap-2"><i class="fas fa-boxes text-indigo-400"></i> Total Inventory Value (MRP)</h3>
                  <p class="text-3xl font-black text-white">₹${totalInventoryValue.toLocaleString('en-IN')}</p>
              </div>
              <div class="bg-transparent backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform">
                  <h3 class="text-gray-300 font-bold mb-2 flex items-center gap-2"><i class="fas fa-box-open text-rose-400"></i> Total Inventory (Buy Price)</h3>
                  <p class="text-3xl font-black text-rose-400 buying-price-display hidden">₹${totalBuyingValue.toLocaleString('en-IN')}</p>
                  <p class="text-3xl font-black text-gray-500 buying-price-hidden-placeholder">********</p>
              </div>
              <div class="bg-transparent backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform">
                  <h3 class="text-gray-300 font-bold mb-2 flex items-center gap-2"><i class="fas fa-tags text-emerald-400"></i> Total Products in Stock</h3>
                  <p class="text-3xl font-black text-white">${totalStockItems} Items</p>
              </div>
          </div>

          <!-- New Sales Report Section -->
          <div class="bg-transparent backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 rounded-2xl mb-8 animate-fade-in-up">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 class="text-xl font-bold text-white flex items-center gap-2"><i class="fas fa-chart-line text-emerald-400"></i> Sales Report</h2>
                  <select id="salesFilter" onchange="updateSalesReport()" class="bg-indigo-500/20 text-white border border-indigo-400/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="daily" class="bg-gray-900">Day by Day</option>
                      <option value="monthly" class="bg-gray-900">Month by Month</option>
                  </select>
              </div>
              <div id="salesReportContent" class="text-white">
                  <!-- Sales data will be rendered here via JS -->
              </div>
          </div>

          <div class="mt-10 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-in-up">
            <h2 class="text-xl font-bold text-white flex items-center gap-2"><i class="fas fa-boxes text-indigo-400"></i> Inventory Sections</h2>
            <button id="toggleBuyPriceBtn" onclick="toggleBuyingPrice()" class="text-sm font-bold bg-transparent text-gray-200 px-5 py-2.5 rounded-xl border border-white/20 hover:border-indigo-400 hover:text-white hover:bg-indigo-500/20 transition-all shadow-sm flex items-center gap-2">
                <i class="fas fa-eye"></i> Show Buying Price
            </button>
          </div>

          <!-- Glassmorphism Search Bar -->
          <div class="relative mb-8 group animate-fade-in-up">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400 group-focus-within:text-indigo-500 transition-colors"></i>
            </div>
            <input type="text" id="staffSearchInput" onkeyup="searchStaffProducts()" placeholder="Search items by Name, Section, or Brand..." 
                   class="w-full pl-11 pr-4 py-4 bg-transparent backdrop-blur-md border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all text-white font-medium placeholder-gray-300">
          </div>

          <div class="space-y-6">
            ${groupedProductsHtml}
          </div>
        </div>

        <!-- Floating Cart Button -->
        <button onclick="toggleCart()" class="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center justify-center text-white text-2xl z-50 transition-transform hover:scale-110">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartItemCount" class="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#050510] transition-transform">0</span>
        </button>

        <!-- Slide-over Cart Panel -->
        <div id="cartPanel" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0f172a] shadow-2xl border-l border-white/10 transform translate-x-full transition-transform duration-300 z-50 flex flex-col">
            <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 class="text-xl font-bold text-white flex items-center gap-2"><i class="fas fa-shopping-basket text-indigo-400"></i> Current Bill</h2>
                <button onclick="toggleCart()" class="text-gray-400 hover:text-white transition-colors"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div id="cartItems" class="flex-1 overflow-y-auto p-6 space-y-4">
                <p class="text-gray-400 text-center italic mt-10">Cart is empty.</p>
            </div>
            <div class="p-6 border-t border-white/10 bg-white/5">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-gray-300 font-bold">Total:</span>
                    <span class="text-2xl font-black text-emerald-400" id="cartTotal">₹0</span>
                </div>
                <form id="checkoutForm" action="/store/checkout" method="POST" onsubmit="return validateCheckout()">
                    <input type="hidden" name="cartData" id="cartDataInput">
                    <input type="text" name="customerName" placeholder="Customer Name (Optional)" class="w-full mb-3 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white">
                    <input type="email" name="customerEmail" placeholder="Customer Email (Optional)" class="w-full mb-4 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white">
                    <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                        Complete Billing
                    </button>
                </form>
            </div>
        </div>

        <!-- Cart Overlay -->
        <div id="cartOverlay" onclick="toggleCart()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden opacity-0 transition-opacity duration-300"></div>

        <script>
            function toggleBuyingPrice() {
                const elements = document.querySelectorAll('.buying-price-display');
                const placeholders = document.querySelectorAll('.buying-price-hidden-placeholder');
                const btn = document.getElementById('toggleBuyPriceBtn');
                let isHidden = btn.innerHTML.includes('Show');
                
                elements.forEach(el => {
                    if (isHidden) {
                        el.classList.remove('hidden');
                    } else {
                        el.classList.add('hidden');
                    }
                    
                    if (el.previousElementSibling && el.previousElementSibling.tagName === 'BUTTON') {
                        const icon = el.previousElementSibling.querySelector('i');
                        if (icon) {
                            if (isHidden) {
                                icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash');
                            } else {
                                icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye');
                            }
                        }
                    }
                });

                placeholders.forEach(el => {
                    if (isHidden) {
                        el.classList.add('hidden');
                    } else {
                        el.classList.remove('hidden');
                    }
                });
                
                if (isHidden) {
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Buying Price';
                } else {
                    btn.innerHTML = '<i class="fas fa-eye"></i> Show Buying Price';
                }
            }

            function toggleSinglePrice(btn) {
                const priceDisplay = btn.nextElementSibling;
                const icon = btn.querySelector('i');
                if (priceDisplay.classList.contains('hidden')) {
                    priceDisplay.classList.remove('hidden');
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    priceDisplay.classList.add('hidden');
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }

            let cart = [];

            function toggleCart() {
                const panel = document.getElementById('cartPanel');
                const overlay = document.getElementById('cartOverlay');
                
                if (panel.classList.contains('translate-x-full')) {
                    panel.classList.remove('translate-x-full');
                    overlay.classList.remove('hidden');
                    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
                } else {
                    panel.classList.add('translate-x-full');
                    overlay.classList.add('opacity-0');
                    setTimeout(() => overlay.classList.add('hidden'), 300);
                }
            }

            function addToCart(id, name, price, maxStock) {
                if (maxStock <= 0) {
                    alert("Out of stock!");
                    return;
                }
                const existing = cart.find(i => i.id === id);
                if (existing) {
                    if (existing.qty < maxStock) {
                        existing.qty++;
                    } else {
                        alert("Maximum stock reached!");
                    }
                } else {
                    cart.push({ id, name, price, qty: 1, maxStock });
                }
                renderCart();
                
                const btn = document.getElementById('cartItemCount');
                btn.classList.add('scale-150');
                setTimeout(() => btn.classList.remove('scale-150'), 200);
            }

            function updateCartQty(id, delta) {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.qty += delta;
                    if (item.qty > item.maxStock) {
                        item.qty = item.maxStock;
                        alert("Maximum stock reached!");
                    }
                    if (item.qty <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                }
                renderCart();
            }

            function renderCart() {
                const container = document.getElementById('cartItems');
                const totalEl = document.getElementById('cartTotal');
                const countEl = document.getElementById('cartItemCount');
                const dataInput = document.getElementById('cartDataInput');
                
                if (cart.length === 0) {
                    container.innerHTML = '<p class="text-gray-400 text-center italic mt-10">Cart is empty.</p>';
                    totalEl.innerText = '₹0';
                    countEl.innerText = '0';
                    dataInput.value = '';
                    return;
                }
                
                let total = 0;
                let count = 0;
                let html = '';
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.qty;
                    total += itemTotal;
                    count += item.qty;
                    
                    html += \`
                        <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                            <div class="flex-1 pr-2">
                                <h4 class="text-sm font-bold text-white mb-1">\${item.name}</h4>
                                <p class="text-xs text-emerald-400 font-bold">₹\${item.price} x \${item.qty} = ₹\${itemTotal}</p>
                            </div>
                            <div class="flex items-center gap-2 bg-black/40 rounded-lg p-1">
                                <button type="button" onclick="updateCartQty(\${item.id}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors">-</button>
                                <span class="text-sm font-bold w-4 text-center">\${item.qty}</span>
                                <button type="button" onclick="updateCartQty(\${item.id}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors">+</button>
                            </div>
                        </div>
                    \`;
                });
                
                container.innerHTML = html;
                totalEl.innerText = '₹' + total.toLocaleString('en-IN');
                countEl.innerText = count;
                dataInput.value = JSON.stringify(cart);
            }

            function validateCheckout() {
                if (cart.length === 0) {
                    alert("Cart is empty! Add items before billing.");
                    return false;
                }
                return true;
            }

            // Pass orders data from server to client
            const ordersData = ${JSON.stringify(orders).replace(/</g, '\\u003c')};

            function updateSalesReport() {
                const filter = document.getElementById('salesFilter').value;
                const reportContent = document.getElementById('salesReportContent');
                
                const grouped = {};
                let total = 0;
                
                ordersData.forEach(o => {
                    const dateStr = o.date || new Date().toISOString().split('T')[0];
                    const dateObj = new Date(dateStr);
                    let key = '';
                    
                    if (filter === 'daily') {
                        key = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    } else if (filter === 'monthly') {
                        key = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                    }
                    
                    if (!grouped[key]) grouped[key] = 0;
                    const price = parseFloat(o.totalPrice) || 0;
                    grouped[key] += price;
                    total += price;
                });
                
                let html = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">';
                for (const [key, val] of Object.entries(grouped)) {
                    html += \`
                        <div class="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-center">
                            <span class="font-bold text-gray-400 text-sm uppercase tracking-wider mb-1">\${key}</span>
                            <span class="text-emerald-400 font-black text-2xl">₹\${val.toLocaleString('en-IN')}</span>
                        </div>
                    \`;
                }
                html += '</div>';
                
                if (Object.keys(grouped).length === 0) {
                    html = '<p class="text-gray-400 italic">No sales data available yet.</p>';
                } else {
                    html += \`
                        <div class="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                            <span class="text-lg font-bold text-white uppercase tracking-wider">Total Sales</span>
                            <span class="text-3xl font-black text-emerald-500">₹\${total.toLocaleString('en-IN')}</span>
                        </div>
                    \`;
                }
                
                reportContent.innerHTML = html;
            }

            document.addEventListener('DOMContentLoaded', () => {
                updateSalesReport();
            });

            function searchBills() {
                const input = document.getElementById("billSearchInput").value.toLowerCase();
                const cards = document.querySelectorAll(".previous-order-card");
                
                cards.forEach(card => {
                    const orderId = card.getAttribute("data-order-id") || "";
                    const customer = card.getAttribute("data-customer") || "";
                    if (orderId.includes(input) || customer.includes(input)) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            }

            function searchStaffProducts() {
                const input = document.getElementById("staffSearchInput").value.toLowerCase();
                const sections = document.querySelectorAll(".category-section-staff");
                
                sections.forEach(section => {
                    const sectionName = section.getAttribute("data-category-name");
                    const cards = section.querySelectorAll(".product-card-staff");
                    const content = section.querySelector(".section-content");
                    let hasVisibleCards = false;
                    
                    cards.forEach(card => {
                        const name = card.getAttribute("data-name");
                        const brand = card.getAttribute("data-brand");
                        
                        if (name.includes(input) || sectionName.includes(input) || brand.includes(input)) {
                            card.style.display = "block";
                            hasVisibleCards = true;
                        } else {
                            card.style.display = "none";
                        }
                    });
                    
                    if (hasVisibleCards || sectionName.includes(input)) {
                        section.style.display = "block";
                        if (input !== "") {
                            content.classList.add("open"); // Auto-expand when searching
                            const icon = section.querySelector('.fa-chevron-down');
                            if (icon) icon.style.transform = 'rotate(180deg)';
                        }
                    } else {
                        section.style.display = "none";
                    }
                });
            }
        </script>
    </body>
    </html>
    `);
});

// Checkout Route (Staff)
router.post('/checkout', staffAuth, (req, res) => {
    try {
        const { cartData, customerName, customerEmail } = req.body;
        if (!cartData) return res.redirect('/store/staff');
        
        const cart = JSON.parse(cartData);
        if (cart.length === 0) return res.redirect('/store/staff');
        
        const orders = getOrders();
        let newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.orderId || 0)) + 1 : 1000;
        const now = new Date().toISOString();
        
        let totalBill = 0;

        for (const item of cart) {
            const product = dbProducts.find(p => p.id === item.id);
            if (product) {
                product.stock = Math.max(0, product.stock - item.qty);
            }
            
            let itemTotal = item.price * item.qty;
            totalBill += itemTotal;

            orders.push({
                orderId: newOrderId,
                customer: customerName || 'Walk-in Customer',
                email: customerEmail || 'N/A',
                productName: item.name,
                quantity: item.qty,
                totalPrice: itemTotal,
                date: now
            });
        }
        
        saveData();
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

        // Generate Printable Bill
        const billText = `*AJAY ENTERPRISES*\n------------------------\nReceipt No: #${newOrderId}\nDate: ${new Date(now).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}\nCustomer: ${customerName || 'Walk-in Customer'}\n------------------------\n${cart.map(item => `${item.name}\n  ${item.qty} x ₹${item.price} = ₹${item.price * item.qty}`).join('\n')}\n------------------------\n*TOTAL: ₹${totalBill.toLocaleString('en-IN')}*\n------------------------\nThank you for shopping!`;
        const encodedBillText = encodeURIComponent(billText);

        const billHtml = `
            <div class="flex flex-col items-center justify-center mt-10 mb-20 relative z-20 animate-fade-in-up">
                
                <!-- Mall POS Thermal Receipt Layout -->
                <div id="receipt-content" class="bg-white text-black p-6 relative shadow-2xl" style="width: 320px; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.4;">
                    <div style="text-align: center; margin-bottom: 10px;">
                        <h2 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 1px;">AJAY ENTERPRISES</h2>
                        <p style="margin: 0; font-size: 11px;">Bhagwatipur near petrol pump</p>
                        <p style="margin: 0; font-size: 11px;">Ph: 91425 19730</p>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <div style="margin-bottom: 10px;">
                        <p style="margin: 0;"><strong>Receipt :</strong> #${newOrderId}</p>
                        <p style="margin: 0;"><strong>Date    :</strong> ${new Date(now).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        <p style="margin: 0;"><strong>Customer:</strong> ${customerName || 'Walk-in Customer'}</p>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding-bottom: 5px;">Item</th>
                                <th style="text-align: center; padding-bottom: 5px;">Qty</th>
                                <th style="text-align: right; padding-bottom: 5px;">Price</th>
                                <th style="text-align: right; padding-bottom: 5px;">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => `
                                <tr>
                                    <td style="padding: 2px 0;">${item.name}</td>
                                    <td style="text-align: center; padding: 2px 0;">${item.qty}</td>
                                    <td style="text-align: right; padding: 2px 0;">${item.price}</td>
                                    <td style="text-align: right; padding: 2px 0;">${item.price * item.qty}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin: 10px 0;">
                        <span>TOTAL:</span>
                        <span>₹${totalBill.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <div style="text-align: center; margin-top: 15px;">
                        <p style="margin: 0;">*** THANK YOU ***</p>
                        <p style="margin: 0;">Please visit us again</p>
                    </div>
                    
                    <!-- Zig-zag bottom paper effect -->
                    <div class="no-print absolute bottom-[-10px] left-0 right-0 h-[10px] bg-repeat-x" style="background-image: radial-gradient(circle at 5px 10px, transparent 6px, white 7px); background-size: 10px 10px;"></div>
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-8 max-w-sm w-full space-y-3 no-print">
                    <button onclick="window.print()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
                        <i class="fas fa-print"></i> Print Receipt
                    </button>
                    <button onclick="shareReceipt()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                        <i class="fas fa-share-nodes"></i> Share via WhatsApp (Image)
                    </button>
                    <div class="grid grid-cols-2 gap-3">
                        <a href="https://wa.me/?text=${encodedBillText}" target="_blank" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 text-sm">
                            <i class="fab fa-whatsapp text-lg"></i> Text Msg
                        </a>
                        <button onclick="downloadReceipt()" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 text-sm">
                            <i class="fas fa-download"></i> Save PNG
                        </button>
                    </div>
                    <a href="/store/staff" class="block mt-2">
                        <button class="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition border border-white/20">
                            Back to Store
                        </button>
                    </a>
                </div>

                <!-- Scripts to handle saving the DOM to an image and sharing -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                <script>
                    async function generateReceiptImage() {
                        const receipt = document.getElementById('receipt-content');
                        // Hide zig zag for clean image border
                        const zigZag = receipt.querySelector('.absolute');
                        if(zigZag) zigZag.style.display = 'none';
                        
                        const canvas = await html2canvas(receipt, { scale: 3, backgroundColor: '#ffffff' });
                        if(zigZag) zigZag.style.display = 'block';
                        return canvas;
                    }

                    async function shareReceipt() {
                        try {
                            const canvas = await generateReceiptImage();
                            canvas.toBlob(async (blob) => {
                                const file = new File([blob], 'Receipt-${newOrderId}.png', { type: 'image/png' });
                                
                                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                    await navigator.share({
                                        title: 'Receipt #${newOrderId}',
                                        text: 'Here is your receipt from Ajay Enterprises.',
                                        files: [file]
                                    });
                                } else {
                                    alert("Your browser doesn't support direct image sharing. The image will be downloaded instead.");
                                    downloadReceipt();
                                }
                            }, 'image/png');
                        } catch(e) {
                            console.log('Share error', e);
                        }
                    }

                    async function downloadReceipt() {
                        const canvas = await generateReceiptImage();
                        const link = document.createElement('a');
                        link.download = 'Receipt-${newOrderId}.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }
                </script>

                <style>
                    @media print {
                        .no-print { display: none !important; }
                        body, html { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
                        .galaxy-bg { display: none !important; }
                        .content-wrapper { padding: 0 !important; margin: 0 !important; }
                        nav { display: none !important; }
                        #receipt-content { box-shadow: none !important; margin: 0 auto !important; border: none !important; }
                    }
                </style>
            </div>
        `;
        return res.send(renderPage(billHtml));
    } catch (e) {
        console.error("Checkout error:", e);
        res.redirect('/store/staff');
    }
});

// View Previous Bill Route
router.get('/bill/:id', staffAuth, (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const orders = getOrders().filter(o => o.orderId === orderId);
        
        if (orders.length === 0) return res.redirect('/store/staff');
        
        const customerName = orders[0].customer;
        const now = orders[0].date;
        let totalBill = 0;
        
        const cart = orders.map(o => {
            totalBill += parseFloat(o.totalPrice) || 0;
            return {
                name: o.productName,
                qty: o.quantity,
                price: (parseFloat(o.totalPrice) / o.quantity) || 0
            };
        });

        const billText = `*AJAY ENTERPRISES*\n------------------------\nReceipt No: #${orderId}\nDate: ${new Date(now).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}\nCustomer: ${customerName || 'Walk-in Customer'}\n------------------------\n${cart.map(item => `${item.name}\n  ${item.qty} x ₹${item.price} = ₹${item.price * item.qty}`).join('\n')}\n------------------------\n*TOTAL: ₹${totalBill.toLocaleString('en-IN')}*\n------------------------\nThank you for shopping!`;
        const encodedBillText = encodeURIComponent(billText);

        const billHtml = `
            <div class="flex flex-col items-center justify-center mt-10 mb-20 relative z-20 animate-fade-in-up">
                
                <!-- Mall POS Thermal Receipt Layout -->
                <div id="receipt-content" class="bg-white text-black p-6 relative shadow-2xl" style="width: 320px; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.4;">
                    <div style="text-align: center; margin-bottom: 10px;">
                        <h2 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 1px;">AJAY ENTERPRISES</h2>
                        <p style="margin: 0; font-size: 11px;">Bhagwatipur near petrol pump</p>
                        <p style="margin: 0; font-size: 11px;">Ph: 91425 19730</p>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <div style="margin-bottom: 10px;">
                        <p style="margin: 0;"><strong>Receipt :</strong> #${orderId}</p>
                        <p style="margin: 0;"><strong>Date    :</strong> ${new Date(now).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        <p style="margin: 0;"><strong>Customer:</strong> ${customerName || 'Walk-in Customer'}</p>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding-bottom: 5px;">Item</th>
                                <th style="text-align: center; padding-bottom: 5px;">Qty</th>
                                <th style="text-align: right; padding-bottom: 5px;">Price</th>
                                <th style="text-align: right; padding-bottom: 5px;">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => `
                                <tr>
                                    <td style="padding: 2px 0;">${item.name}</td>
                                    <td style="text-align: center; padding: 2px 0;">${item.qty}</td>
                                    <td style="text-align: right; padding: 2px 0;">${item.price}</td>
                                    <td style="text-align: right; padding: 2px 0;">${item.price * item.qty}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin: 10px 0;">
                        <span>TOTAL:</span>
                        <span>₹${totalBill.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
                    <div style="text-align: center; margin-top: 15px;">
                        <p style="margin: 0;">*** THANK YOU ***</p>
                        <p style="margin: 0;">Please visit us again</p>
                    </div>
                    
                    <!-- Zig-zag bottom paper effect -->
                    <div class="no-print absolute bottom-[-10px] left-0 right-0 h-[10px] bg-repeat-x" style="background-image: radial-gradient(circle at 5px 10px, transparent 6px, white 7px); background-size: 10px 10px;"></div>
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-8 max-w-sm w-full space-y-3 no-print">
                    <button onclick="window.print()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
                        <i class="fas fa-print"></i> Print Receipt
                    </button>
                    <button onclick="shareReceipt()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                        <i class="fas fa-share-nodes"></i> Share via WhatsApp (Image)
                    </button>
                    <div class="grid grid-cols-2 gap-3">
                        <a href="https://wa.me/?text=${encodedBillText}" target="_blank" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 text-sm">
                            <i class="fab fa-whatsapp text-lg"></i> Text Msg
                        </a>
                        <button onclick="downloadReceipt()" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 text-sm">
                            <i class="fas fa-download"></i> Save PNG
                        </button>
                    </div>
                    <a href="/store/staff" class="block mt-2">
                        <button class="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition border border-white/20">
                            Back to Store
                        </button>
                    </a>
                </div>

                <!-- Scripts to handle saving the DOM to an image and sharing -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                <script>
                    async function generateReceiptImage() {
                        const receipt = document.getElementById('receipt-content');
                        // Hide zig zag for clean image border
                        const zigZag = receipt.querySelector('.absolute');
                        if(zigZag) zigZag.style.display = 'none';
                        
                        const canvas = await html2canvas(receipt, { scale: 3, backgroundColor: '#ffffff' });
                        if(zigZag) zigZag.style.display = 'block';
                        return canvas;
                    }

                    async function shareReceipt() {
                        try {
                            const canvas = await generateReceiptImage();
                            canvas.toBlob(async (blob) => {
                                const file = new File([blob], 'Receipt-${orderId}.png', { type: 'image/png' });
                                
                                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                    await navigator.share({
                                        title: 'Receipt #${orderId}',
                                        text: 'Here is your receipt from Ajay Enterprises.',
                                        files: [file]
                                    });
                                } else {
                                    alert("Your browser doesn't support direct image sharing. The image will be downloaded instead.");
                                    downloadReceipt();
                                }
                            }, 'image/png');
                        } catch(e) {
                            console.log('Share error', e);
                        }
                    }

                    async function downloadReceipt() {
                        const canvas = await generateReceiptImage();
                        const link = document.createElement('a');
                        link.download = 'Receipt-${orderId}.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }
                </script>

                <style>
                    @media print {
                        .no-print { display: none !important; }
                        body, html { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
                        .galaxy-bg { display: none !important; }
                        .content-wrapper { padding: 0 !important; margin: 0 !important; }
                        nav { display: none !important; }
                        #receipt-content { box-shadow: none !important; margin: 0 auto !important; border: none !important; }
                    }
                </style>
            </div>
        `;
        return res.send(renderPage(billHtml));
    } catch (e) {
        console.error("View Bill error:", e);
        res.redirect('/store/staff');
    }
});

// Cancel Order Route
router.post('/cancel-order', staffAuth, (req, res) => {
    try {
        const orderId = parseInt(req.body.orderId);
        let orders = getOrders();
        const orderItems = orders.filter(o => o.orderId === orderId);
        
        if (orderItems.length > 0) {
            // Restore stock
            for (const item of orderItems) {
                const product = dbProducts.find(p => p.name === item.productName);
                if (product) {
                    product.stock += item.quantity;
                }
            }
            saveData();
            
            // Remove order
            orders = orders.filter(o => o.orderId !== orderId);
            fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
        }
    } catch (e) {
        console.error("Cancel order error:", e);
    }
    res.redirect('/store/staff');
});

// Delete Order Route
router.post('/delete-order', staffAuth, (req, res) => {
    try {
        const orderId = parseInt(req.body.orderId);
        let orders = getOrders();
        orders = orders.filter(o => o.orderId !== orderId);
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    } catch (e) {
        console.error("Delete order error:", e);
    }
    res.redirect('/store/staff');
});

// Owner Dashboard Route
router.get('/owner', ownerAuth, async (req, res) => {
    let orders = getOrders();
    const products = dbProducts;
    const categoriesDocs = dbCategories;
    const categories = categoriesDocs.map(c => c.name);
    
    // Calculate revenues by date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    let todayRevenue = 0, weekRevenue = 0, monthRevenue = 0, yearRevenue = 0, totalRevenue = 0;

    orders.forEach(o => {
        const orderDate = new Date(o.date);
        const price = parseFloat(o.totalPrice) || 0;
        totalRevenue += price;
        if (orderDate >= startOfDay) todayRevenue += price;
        if (orderDate >= startOfWeek) weekRevenue += price;
        if (orderDate >= startOfMonth) monthRevenue += price;
        if (orderDate >= startOfYear) yearRevenue += price;
    });

    const totalOrders = orders.length;
    const lowStockCount = products.filter(p => p.stock < 10).length;
    const activeCategories = categories.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalBuyingValue = products.reduce((sum, p) => sum + ((p.buyingPrice || 0) * p.stock), 0);
    
    const ordersHtml = orders.length > 0 ? [...orders].reverse().map(o => `
        <div class="ticket" style="margin-bottom: 15px;">
            <div class="ticket-main">
                <div class="event-title" style="font-size: 1.2em;">Order #${o.orderId}</div>
                <div class="event-meta">Item: ${o.productName} (x${o.quantity})</div>
                <div class="ticket-details" style="margin-top: 15px; flex-wrap: wrap; gap: 10px;">
                    <div class="detail-group"><span class="detail-label">Total Paid</span><span class="detail-value" style="color:var(--accent-green);">₹${o.totalPrice}</span></div>
                    <div class="detail-group"><span class="detail-label">Customer</span><span class="detail-value" style="font-size:0.8em;">${o.customer}</span></div>
                </div>
            </div>
        </div>
    `).join('') : '<p style="text-align:center; color:var(--text-muted);">No orders yet.</p>';

    const groupedProductsHtml = categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const productsHtml = categoryProducts.map(product => `
            <article class="card product-card-owner" data-name="${product.name.toLowerCase()}" data-brand="${product.brand.toLowerCase()}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="margin-bottom: 5px;">${product.name}</h3>
                        <span style="font-size: 0.85em; color: var(--text-muted); font-weight: bold;"><i class="fas fa-building"></i> ${product.brand}</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end;">
                        <span style="background:var(--accent-red); color:white; padding:3px 8px; border-radius:8px; font-size: 0.8em; white-space: nowrap;">Buy: ₹${product.buyingPrice || 0}</span>
                        <span style="background:var(--accent-green); color:white; padding:3px 8px; border-radius:8px; font-size: 0.8em; white-space: nowrap;">Sell: ₹${product.price}</span>
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: var(--text-muted);">
                    <span><i class="fas fa-tags"></i> ${product.category}</span>
                    <span><i class="fas fa-boxes"></i> Stock: ${product.stock}</span>
                </div>
                <p style="font-size: 0.9em; margin: 5px 0;"><i class="fas fa-calendar-alt"></i> Arrival: ${product.arrivalDate || 'N/A'}</p>
                <p style="font-size: 0.9em; margin: 5px 0; color: var(--accent-green); font-weight: bold;"><i class="fas fa-chart-line"></i> Profit/Unit: ₹${product.price - (product.buyingPrice || 0)}</p>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <a href="/store/edit/${product.id}" style="flex: 1;"><button class="btn-secondary" style="width: 100%;"><i class="fas fa-edit"></i> Edit</button></a>
                    <form action="/store/delete" method="POST" style="flex: 1; margin: 0;">
                        <input type="hidden" name="id" value="${product.id}">
                        <button type="submit" class="btn-danger" style="width: 100%;" onclick="return confirm('Delete this product?')"><i class="fas fa-trash"></i> Delete</button>
                    </form>
                </div>
            </article>
        `).join('');

        return `
            <div class="category-section" data-category-name="${category.toLowerCase()}" style="margin-bottom: 20px;">
                <h3 class="section-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('active')">
                    <span><i class="fas fa-layer-group"></i> ${category}</span>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <form action="/store/delete-category" method="POST" style="margin: 0;" onclick="event.stopPropagation();">
                            <input type="hidden" name="categoryName" value="${category}">
                            <button type="submit" class="btn-danger" style="padding: 5px 10px; font-size: 0.8em; border-radius: 6px;" onclick="return confirm('Are you sure you want to delete the section \\'${category}\\' and ALL products inside it?')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </form>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </h3>
                <div class="product-grid section-content">
                    ${productsHtml || '<p style="color: var(--text-muted); font-style: italic; grid-column: 1 / -1;">No products in this section yet.</p>'}
                </div>
            </div>
        `;
    }).join('');

    res.send(renderPage(`
        <div class="kpi-grid">
            <div class="kpi-card" style="--glow-color: #10B981; grid-column: 1 / -1;">
                <div class="kpi-title"><i class="fas fa-wallet"></i> Revenue Breakdown</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 10px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                            Date
                            <input type="date" id="revDate" onchange="updateRevenues()" style="width: 125px; padding: 2px 5px; margin: 0; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 0.9em; border-radius: 6px; cursor: pointer;">
                        </div>
                        <div id="revDayVal" style="font-size: 1.8em; font-weight: 900; color: white;">...</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                            Week
                            <input type="week" id="revWeek" onchange="updateRevenues()" style="width: 125px; padding: 2px 5px; margin: 0; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 0.9em; border-radius: 6px; cursor: pointer;">
                        </div>
                        <div id="revWeekVal" style="font-size: 1.8em; font-weight: 900; color: white;">...</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                            Month
                            <input type="month" id="revMonth" onchange="updateRevenues()" style="width: 125px; padding: 2px 5px; margin: 0; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 0.9em; border-radius: 6px; cursor: pointer;">
                        </div>
                        <div id="revMonthVal" style="font-size: 1.8em; font-weight: 900; color: white;">...</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                            Year
                            <input type="number" id="revYear" onchange="updateRevenues()" placeholder="YYYY" style="width: 80px; padding: 2px 5px; margin: 0; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 0.9em; border-radius: 6px; cursor: pointer;">
                        </div>
                        <div id="revYearVal" style="font-size: 1.8em; font-weight: 900; color: var(--accent-green);">...</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Lifetime</div>
                        <div id="revLifetimeVal" style="font-size: 1.8em; font-weight: 900; color: var(--accent-purple);">...</div>
                    </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title"><i class="fas fa-shopping-cart"></i> Total Orders</div>
                <div class="kpi-value">${totalOrders}</div>
                <div class="kpi-trend" style="color: var(--text-muted);">All-time</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title"><i class="fas fa-layer-group"></i> Active Categories</div>
                <div class="kpi-value">${activeCategories}</div>
                <div class="kpi-trend" style="color: var(--text-muted);">Sections</div>
            </div>
            <div class="kpi-card ${lowStockCount > 0 ? 'alert' : ''}" style="--glow-color: #EF4444;">
                <div class="kpi-title"><i class="fas fa-exclamation-triangle"></i> Low Stock Items</div>
                <div class="kpi-value">${lowStockCount}</div>
                <div class="kpi-trend" style="color: ${lowStockCount > 0 ? 'var(--accent-red)' : 'var(--text-muted)'};">Items with stock < 10</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title"><i class="fas fa-boxes text-indigo-400"></i> Inventory Value (MRP)</div>
                <div class="kpi-value">₹${totalInventoryValue.toLocaleString('en-IN')}</div>
                <div class="kpi-trend" style="color: var(--text-muted);">Total Selling Price</div>
            </div>
            <div class="kpi-card" onclick="this.querySelector('.buy-price-val').classList.toggle('hidden'); this.querySelector('.buy-price-placeholder').classList.toggle('hidden');" style="cursor: pointer;">
                <div class="kpi-title"><i class="fas fa-box-open text-rose-400"></i> Inventory Value (Buy)</div>
                <div class="kpi-value buy-price-val hidden" style="color: var(--accent-red);">₹${totalBuyingValue.toLocaleString('en-IN')}</div>
                <div class="kpi-value buy-price-placeholder" style="color: #64748b;">********</div>
                <div class="kpi-trend" style="color: var(--text-muted);"><i class="fas fa-hand-pointer"></i> Click to reveal</div>
            </div>
        </div>

        <div class="workspace-grid">
            <div class="inventory-panel">
                <h2><i class="fas fa-boxes"></i> Inventory Master Panel</h2>
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="ownerSearchInput" onkeyup="searchOwnerProducts()" placeholder="Search products, sections, or brands...">
                </div>
                ${groupedProductsHtml}
            </div>
            <div class="actions-hub">
                <h2><i class="fas fa-bolt"></i> Actions & Live Feed</h2>
                <div class="quick-actions">
                    <a href="/store/add" style="flex:1;"><button style="width:100%; background: var(--accent-teal);"><i class="fas fa-plus"></i> Add Product</button></a>
                    <a href="/store/add-category" style="flex:1;"><button style="width:100%;"><i class="fas fa-folder-plus"></i> Add Section</button></a>
                </div>
                <div class="live-orders">
                    <h3><i class="fas fa-stream"></i> Live Orders</h3>
                    <div style="max-height: 500px; overflow-y: auto; padding-right: 10px;" class="custom-scrollbar">
                        ${ordersHtml}
                    </div>
                </div>
                 <div style="margin-top: 30px;">
                    <a href="/store/settings"><button style="width:100%; background: #4A5568;"><i class="fas fa-cog"></i> Security Settings</button></a>
                </div>
            </div>
        </div>
        
        <script>
            const ownerOrders = ${JSON.stringify(orders).replace(/</g, '\\u003c')};

            document.addEventListener('DOMContentLoaded', () => {
                const now = new Date();
                const offset = now.getTimezoneOffset() * 60000;
                const localISOTime = (new Date(now - offset)).toISOString().slice(0, -1);
                
                // Set default inputs to exactly 'today' using client timezone
                document.getElementById('revDate').value = localISOTime.split('T')[0];
                document.getElementById('revMonth').value = localISOTime.substring(0, 7);
                document.getElementById('revYear').value = now.getFullYear();
                
                const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
                const dayNum = d.getUTCDay() || 7;
                d.setUTCDate(d.getUTCDate() + 4 - dayNum);
                const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
                const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
                document.getElementById('revWeek').value = d.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
                
                updateRevenues();
            });

            function getWeekRange(year, week) {
                const simple = new Date(year, 0, 1 + (week - 1) * 7);
                const dow = simple.getDay();
                const ISOweekStart = simple;
                if (dow <= 4)
                    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
                else
                    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
                
                const ISOweekEnd = new Date(ISOweekStart);
                ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
                ISOweekEnd.setHours(23, 59, 59, 999);
                return { start: ISOweekStart, end: ISOweekEnd };
            }

            function updateRevenues() {
                const dateInput = document.getElementById('revDate').value; 
                const weekInput = document.getElementById('revWeek').value; 
                const monthInput = document.getElementById('revMonth').value; 
                const yearInput = document.getElementById('revYear').value; 

                let dayRev = 0, weekRev = 0, monthRev = 0, yearRev = 0, lifeRev = 0;

                let weekStart, weekEnd;
                if (weekInput && weekInput.includes('-W')) {
                    const parts = weekInput.split('-W');
                    const range = getWeekRange(parseInt(parts[0]), parseInt(parts[1]));
                    weekStart = range.start;
                    weekEnd = range.end;
                }

                ownerOrders.forEach(o => {
                    if (!o.date) return;
                    const oDate = new Date(o.date);
                    const price = parseFloat(o.totalPrice) || 0;
                    lifeRev += price;

                    // Timezone-safe local date calculation
                    const oOffset = oDate.getTimezoneOffset() * 60000;
                    const oLocalISO = (new Date(oDate.getTime() - oOffset)).toISOString().slice(0, -1);
                    const oDateStr = oLocalISO.split('T')[0];

                    if (dateInput && oDateStr === dateInput) {
                        dayRev += price;
                    }
                    
                    if (weekStart && weekEnd && oDate >= weekStart && oDate <= weekEnd) {
                        weekRev += price;
                    }

                    if (monthInput && oDateStr.substring(0, 7) === monthInput) {
                        monthRev += price;
                    }

                    if (yearInput && oDate.getFullYear().toString() === yearInput.toString()) {
                        yearRev += price;
                    }
                });

                document.getElementById('revDayVal').innerText = '₹' + dayRev.toLocaleString('en-IN');
                document.getElementById('revWeekVal').innerText = '₹' + weekRev.toLocaleString('en-IN');
                document.getElementById('revMonthVal').innerText = '₹' + monthRev.toLocaleString('en-IN');
                document.getElementById('revYearVal').innerText = '₹' + yearRev.toLocaleString('en-IN');
                document.getElementById('revLifetimeVal').innerText = '₹' + lifeRev.toLocaleString('en-IN');
            }

            function searchOwnerProducts() {
                const input = document.getElementById("ownerSearchInput").value.toLowerCase();
                const sections = document.querySelectorAll(".category-section");
                
                sections.forEach(section => {
                    const sectionName = section.getAttribute("data-category-name");
                    const cards = section.querySelectorAll(".product-card-owner");
                    const content = section.querySelector(".section-content");
                    const header = section.querySelector(".section-header");
                    let hasVisibleCards = false;
                    
                    cards.forEach(card => {
                        const name = card.getAttribute("data-name");
                        const brand = card.getAttribute("data-brand");
                        
                        if (name.includes(input) || sectionName.includes(input) || brand.includes(input)) {
                            card.style.display = "block";
                            hasVisibleCards = true;
                        } else {
                            card.style.display = "none";
                        }
                    });
                    
                    if (hasVisibleCards || sectionName.includes(input)) {
                        section.style.display = "block";
                        if (input !== "") {
                            content.classList.add("active"); // Auto-expand when searching
                            header.classList.add("active");
                        }
                    } else {
                        section.style.display = "none";
                    }
                });
            }
        </script>
    `));
});

// Add Section Route
router.get('/add-category', ownerAuth, (req, res) => {
    res.send(renderPage(`
        <div class="card">
            <h2>Add New Section</h2>
            <form action="/store/add-category" method="POST">
                <label>Section Name:</label>
                <input type="text" name="newCategory" placeholder="e.g. Snacks, Soft Drinks, Biscuits" required>
                <br><br>
                <button type="submit"><i class="fas fa-folder-plus"></i> Add Section</button>
                <a href="/store/owner"><button type="button" class="btn-secondary">Cancel</button></a>
            </form>
        </div>
    `));
});

router.post('/add-category', ownerAuth, async (req, res) => {
    const { newCategory } = req.body;
    if (newCategory) {
        const exists = dbCategories.find(c => c.name === newCategory);
        if (!exists) {
            dbCategories.push({ name: newCategory });
            saveData();
        }
    }
    res.redirect('/store/owner');
});

// Add Product Routes
router.get('/add', ownerAuth, async (req, res) => {
    const categoriesDocs = dbCategories;
    const categories = categoriesDocs.map(c => c.name);
    const categoryOptions = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    res.send(renderPage(`
        <div class="card">
            <h2>Add New Product</h2>
            <form action="/store/add" method="POST">
                <label>Section (Category):</label>
                <select name="category" required>
                    <option value="" disabled selected>Select a section</option>
                    ${categoryOptions}
                </select>
                <label>Item Name:</label>
                <input type="text" name="name" placeholder="e.g. Fresh Milk 1L" required>
                <label>Company/Brand:</label>
                <input type="text" name="brand" placeholder="e.g. Amul, Nestle" required>
                <label>Buying Price (₹):</label>
                <input type="number" name="buyingPrice" required>
                <label>Selling Price (₹):</label>
                <input type="number" name="price" required>
                <label>Arrival Date:</label>
                <input type="date" name="arrivalDate" required>
                <label>Initial Stock (Quantity):</label>
                <input type="number" name="stock" required>
                <br><br>
                <button type="submit"><i class="fas fa-plus"></i> Add Product</button>
                <a href="/store/owner"><button type="button" class="btn-secondary">Cancel</button></a>
            </form>
        </div>
    `));
});

router.post('/add', ownerAuth, async (req, res) => {
    const { name, category, brand, buyingPrice, price, arrivalDate, stock } = req.body;
    let newId = 1;
    if (dbProducts.length > 0) {
        newId = Math.max(...dbProducts.map(p => p.id)) + 1;
    }
    dbProducts.push({ id: newId, name, category, brand, buyingPrice: parseInt(buyingPrice), price: parseInt(price), stock: parseInt(stock), arrivalDate });
    saveData();
    res.redirect('/store/owner');
});

// Edit Product Routes (Owner)
router.get('/edit/:id', ownerAuth, async (req, res) => {
    const product = dbProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.redirect('/store/owner');
    
    const categoriesDocs = dbCategories;
    const categories = categoriesDocs.map(c => c.name);
    const categoryOptions = categories.map(cat => `<option value="${cat}" ${product.category === cat ? 'selected' : ''}>${cat}</option>`).join('');

    res.send(renderPage(`
        <div class="card">
            <h2>Edit Product</h2>
            <form action="/store/edit" method="POST">
                <input type="hidden" name="id" value="${product.id}">
                <label>Section (Category):</label>
                <select name="category" required>
                    ${categoryOptions}
                </select>
                <label>Item Name:</label>
                <input type="text" name="name" value="${product.name}" required>
                <label>Company/Brand:</label>
                <input type="text" name="brand" value="${product.brand || ''}" required>
                <label>Buying Price (₹):</label>
                <input type="number" name="buyingPrice" value="${product.buyingPrice || 0}" required>
                <label>Selling Price (₹):</label>
                <input type="number" name="price" value="${product.price}" required>
                <label>Arrival Date:</label>
                <input type="date" name="arrivalDate" value="${product.arrivalDate || ''}" required>
                <label>Stock (Quantity):</label>
                <input type="number" name="stock" value="${product.stock}" required>
                <br><br>
                <button type="submit"><i class="fas fa-save"></i> Update Product</button>
                <a href="/store/owner"><button type="button" class="btn-secondary">Cancel</button></a>
            </form>
        </div>
    `));
});

router.post('/edit', ownerAuth, async (req, res) => {
    const { id, name, category, brand, buyingPrice, price, arrivalDate, stock } = req.body;
    const productIndex = dbProducts.findIndex(p => p.id === parseInt(id));
    if (productIndex !== -1) {
        dbProducts[productIndex] = { ...dbProducts[productIndex], name, category, brand, buyingPrice: parseInt(buyingPrice), price: parseInt(price), stock: parseInt(stock), arrivalDate };
        saveData();
    }
    res.redirect('/store/owner');
});

// Update Stock Routes (Staff)
router.get('/stock/:id', staffAuth, async (req, res) => {
    const product = dbProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.redirect('/store/staff');
    
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Update Stock - ${product.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 text-gray-800 font-sans min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h2 class="text-xl font-bold text-blue-900">Update Stock</h2>
                <p class="text-sm text-blue-700 mt-1">${product.name} &bull; ${product.brand}</p>
            </div>
            <form action="/store/stock" method="POST" class="p-6 space-y-4">
                <input type="hidden" name="id" value="${product.id}">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Stock:</label>
                    <input type="number" name="stock" value="${product.stock}" required
                           class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition shadow-sm">
                        Save Changes
                    </button>
                    <a href="/store/staff" class="flex-1">
                        <button type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition">
                            Cancel
                        </button>
                    </a>
                </div>
            </form>
        </div>
    </body>
    </html>
    `);
});

router.post('/stock', staffAuth, async (req, res) => {
    const { id, stock } = req.body;
    const product = dbProducts.find(p => p.id === parseInt(id));
    if (product) {
        product.stock = parseInt(stock);
        saveData();
    }
    res.redirect('/store/staff');
});

// Delete Product Route
router.post('/delete', ownerAuth, async (req, res) => {
    const { id } = req.body;
    dbProducts = dbProducts.filter(p => p.id !== parseInt(id));
    saveData();
    res.redirect('/store/owner');
});

// Delete Section (Category) Route
router.post('/delete-category', ownerAuth, async (req, res) => {
    const { categoryName } = req.body;
    if (categoryName) {
        dbCategories = dbCategories.filter(c => c.name !== categoryName);
        dbProducts = dbProducts.filter(p => p.category !== categoryName);
        saveData();
    }
    res.redirect('/store/owner');
});

// Settings Route (Owner only) - Change Passwords
router.get('/settings', ownerAuth, (req, res) => {
    res.send(renderPage(`
        <div class="card">
            <h2><i class="fas fa-cog"></i> Security Settings</h2>
            <form action="/store/settings" method="POST">
                <label>New Staff Password (leave blank to keep current):</label>
                <input type="text" name="staffPassword" placeholder="Current: ${credentials.staff}">
                <label>New Owner Password (leave blank to keep current):</label>
                <input type="text" name="ownerPassword" placeholder="Current: ${credentials.owner}">
                <br><br>
                <button type="submit"><i class="fas fa-save"></i> Save Changes</button>
                <a href="/store/owner"><button type="button" class="btn-secondary">Cancel</button></a>
            </form>
        </div>
    `));
});

router.post('/settings', ownerAuth, (req, res) => {
    const { staffPassword, ownerPassword } = req.body;
    if (staffPassword && staffPassword.trim() !== '') credentials.staff = staffPassword.trim();
    if (ownerPassword && ownerPassword.trim() !== '') credentials.owner = ownerPassword.trim();
    
    res.redirect('/store/owner');
});

module.exports = router;