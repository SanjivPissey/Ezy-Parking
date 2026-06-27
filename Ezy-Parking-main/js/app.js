/**
 * Ezy-Parking - Shared Application Data Layer
 * Handles mock data, localStorage persistence, auth, bookings, violations, community posts
 */

const EzyParking = (function () {

    // ─── Mock Parking Lots ───
    const PARKING_LOTS = [
        { id: 'LOT001', name: 'City Center Parking', address: '123 MG Road, Bangalore', lat: 12.9716, lng: 77.5946, pricePerHour: 40, totalSlots: 48, type: 'Multi-Level', rating: 4.5, image: 'lot1' },
        { id: 'LOT002', name: 'Metro Mall Parking', address: '45 Brigade Road, Bangalore', lat: 12.9719, lng: 77.6072, pricePerHour: 50, totalSlots: 60, type: 'Basement', rating: 4.2, image: 'lot2' },
        { id: 'LOT003', name: 'Tech Park Lot A', address: '789 Whitefield, Bangalore', lat: 12.9698, lng: 77.7500, pricePerHour: 30, totalSlots: 100, type: 'Open Air', rating: 3.8, image: 'lot3' },
        { id: 'LOT004', name: 'Airport Terminal Parking', address: 'KIA Terminal 1, Bangalore', lat: 13.1989, lng: 77.7068, pricePerHour: 80, totalSlots: 200, type: 'Multi-Level', rating: 4.7, image: 'lot4' },
        { id: 'LOT005', name: 'Railway Station Lot', address: 'Majestic, Bangalore', lat: 12.9772, lng: 77.5713, pricePerHour: 20, totalSlots: 36, type: 'Open Air', rating: 3.5, image: 'lot5' },
        { id: 'LOT006', name: 'Lakeview Parking', address: '12 Ulsoor Lake Rd, Bangalore', lat: 12.9825, lng: 77.6200, pricePerHour: 35, totalSlots: 40, type: 'Covered', rating: 4.0, image: 'lot6' },
        { id: 'LOT007', name: 'Forum Mall Parking', address: 'Koramangala, Bangalore', lat: 12.9346, lng: 77.6117, pricePerHour: 60, totalSlots: 80, type: 'Basement', rating: 4.4, image: 'lot7' },
        { id: 'LOT008', name: 'Indiranagar Hub', address: '100 Ft Road, Indiranagar', lat: 12.9784, lng: 77.6408, pricePerHour: 45, totalSlots: 30, type: 'Street', rating: 3.9, image: 'lot8' },
        { id: 'LOT009', name: 'JP Nagar Complex', address: '15th Cross, JP Nagar', lat: 12.9063, lng: 77.5857, pricePerHour: 25, totalSlots: 50, type: 'Open Air', rating: 3.6, image: 'lot9' },
        { id: 'LOT010', name: 'Electronic City Tower', address: 'Phase 1, Electronic City', lat: 12.8399, lng: 77.6770, pricePerHour: 35, totalSlots: 70, type: 'Multi-Level', rating: 4.1, image: 'lot10' }
    ];

    // ─── Mock Nearby Events ───
    const EVENTS = [
        { name: 'Tech Conference 2026', venue: 'City Center Convention Hall', date: '2026-04-20', time: '09:00 AM', category: 'Technology' },
        { name: 'Food Festival', venue: 'Lakeview Gardens', date: '2026-04-18', time: '11:00 AM', category: 'Food' },
        { name: 'Live Music Night', venue: 'Forum Mall Arena', date: '2026-04-19', time: '07:00 PM', category: 'Entertainment' },
        { name: 'Startup Meetup', venue: 'Tech Park Hall B', date: '2026-04-22', time: '05:00 PM', category: 'Business' },
        { name: 'Art Exhibition', venue: 'Indiranagar Gallery', date: '2026-04-17', time: '10:00 AM', category: 'Art' },
        { name: 'Marathon 2026', venue: 'Cubbon Park', date: '2026-04-21', time: '06:00 AM', category: 'Sports' }
    ];

    // ─── Mock Vehicle Database ───
    const VEHICLES = {
        'KA01AB1234': { owner: 'Rahul Sharma', model: 'Hyundai i20', color: 'White', type: 'Car' },
        'KA02CD5678': { owner: 'Priya Patel', model: 'Honda City', color: 'Silver', type: 'Car' },
        'KA03EF9012': { owner: 'Amit Kumar', model: 'Maruti Swift', color: 'Red', type: 'Car' },
        'KA04GH3456': { owner: 'Sneha Reddy', model: 'Toyota Innova', color: 'Black', type: 'SUV' },
        'KA05IJ7890': { owner: 'Vikram Singh', model: 'Royal Enfield', color: 'Matte Black', type: 'Bike' },
        'KA06KL2345': { owner: 'Deepa Nair', model: 'Kia Seltos', color: 'Blue', type: 'SUV' },
    };

    // ─── No-Parking Zones ───
    const NO_PARKING_ZONES = [
        { id: 'NP001', name: 'MG Road Bus Stop', area: 'MG Road' },
        { id: 'NP002', name: 'Brigade Road Signal Junction', area: 'Brigade Road' },
        { id: 'NP003', name: 'Hospital Emergency Entrance', area: 'Jayanagar' },
        { id: 'NP004', name: 'School Zone - DPS', area: 'Whitefield' },
        { id: 'NP005', name: 'Fire Station Access Road', area: 'Koramangala' },
        { id: 'NP006', name: 'Metro Construction Zone', area: 'Indiranagar' },
    ];

    // ─── LocalStorage Keys ───
    const KEYS = {
        USER: 'ezy_user',
        BOOKINGS: 'ezy_bookings',
        VIOLATIONS: 'ezy_violations',
        COMMUNITY: 'ezy_community',
        SLOT_STATE: 'ezy_slots',
        GATE_LOG: 'ezy_gate_log'
    };

    // ─── Utility Helpers ───
    function generateId(prefix) {
        return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function formatTime(timeStr) {
        const [h, m] = timeStr.split(':');
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hr = h % 12 || 12;
        return `${hr}:${m} ${ampm}`;
    }

    function formatDateTime(dt) {
        if (!dt) return '—';
        const d = new Date(dt);
        return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function calculateCost(entryTime, exitTime, pricePerHour) {
        const diff = (new Date(exitTime) - new Date(entryTime)) / (1000 * 60 * 60);
        const hours = Math.max(Math.ceil(diff), 1);
        return { hours, cost: hours * pricePerHour };
    }

    // ─── Storage Helpers ───
    function getStore(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch (e) { return []; }
    }

    function setStore(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getUser() {
        try { return JSON.parse(localStorage.getItem(KEYS.USER)); }
        catch (e) { return null; }
    }

    function setUser(user) {
        localStorage.setItem(KEYS.USER, JSON.stringify(user));
    }

    // ─── Auth ───
    function signup(name, email, password) {
        const user = { name, email, password, createdAt: new Date().toISOString() };
        setUser(user);
        return user;
    }

    function login(email, password) {
        const user = getUser();
        if (user && user.email === email && user.password === password) return user;
        return null;
    }

    function logout() {
        localStorage.removeItem(KEYS.USER);
    }

    function isLoggedIn() {
        return !!getUser();
    }

    // ─── Bookings ───
    function createBooking(data) {
        const bookings = getStore(KEYS.BOOKINGS);
        const booking = {
            id: generateId('BK'),
            lotId: data.lotId,
            lotName: data.lotName,
            slotNumber: data.slotNumber || 'Auto-Assigned',
            vehicleReg: data.vehicleReg.toUpperCase(),
            vehicleType: data.vehicleType,
            vehicleColor: data.vehicleColor,
            entryTime: data.entryTime,
            exitTime: data.exitTime,
            cost: data.cost,
            hours: data.hours,
            status: 'Active',
            createdAt: new Date().toISOString()
        };
        bookings.push(booking);
        setStore(KEYS.BOOKINGS, bookings);
        return booking;
    }

    function getBookings() {
        return getStore(KEYS.BOOKINGS);
    }

    function cancelBooking(id) {
        const bookings = getStore(KEYS.BOOKINGS);
        const idx = bookings.findIndex(b => b.id === id);
        if (idx > -1) {
            bookings[idx].status = 'Cancelled';
            setStore(KEYS.BOOKINGS, bookings);
            return true;
        }
        return false;
    }

    function findVehicleBooking(regNumber) {
        const bookings = getStore(KEYS.BOOKINGS);
        return bookings.filter(b => b.vehicleReg === regNumber.toUpperCase() && b.status === 'Active');
    }

    // ─── Slot State ───
    function initSlots(lotId, totalSlots) {
        const slots = [];
        for (let i = 1; i <= totalSlots; i++) {
            const rand = Math.random();
            let state = 'available';
            if (rand < 0.45) state = 'occupied';
            else if (rand < 0.55) state = 'reserved';
            else if (rand < 0.58) state = 'disabled';
            slots.push({ number: i, state, vehicleReg: state === 'occupied' ? 'KA0' + Math.floor(Math.random() * 9 + 1) + 'XX' + Math.floor(Math.random() * 9000 + 1000) : null });
        }
        const data = {};
        data[lotId] = slots;
        setStore(KEYS.SLOT_STATE, data);
        return slots;
    }

    function getSlots(lotId) {
        const data = getStore(KEYS.SLOT_STATE) || {};
        return data[lotId] || null;
    }

    function updateSlotState(lotId, slotNumber, newState, vehicleReg) {
        const all = JSON.parse(localStorage.getItem(KEYS.SLOT_STATE)) || {};
        if (all[lotId]) {
            const slot = all[lotId].find(s => s.number === slotNumber);
            if (slot) {
                slot.state = newState;
                slot.vehicleReg = vehicleReg || null;
                localStorage.setItem(KEYS.SLOT_STATE, JSON.stringify(all));
            }
        }
    }

    // ─── Gate Log ───
    function addGateLog(entry) {
        const logs = getStore(KEYS.GATE_LOG);
        logs.unshift({
            id: generateId('GL'),
            vehicleReg: entry.vehicleReg,
            action: entry.action,
            bookingId: entry.bookingId || '—',
            timestamp: new Date().toISOString()
        });
        if (logs.length > 50) logs.length = 50;
        setStore(KEYS.GATE_LOG, logs);
        return logs;
    }

    function getGateLogs() {
        return getStore(KEYS.GATE_LOG);
    }

    // ─── Violations ───
    function reportViolation(data) {
        const violations = getStore(KEYS.VIOLATIONS);
        const vehicle = VEHICLES[data.vehicleReg.toUpperCase()] || { owner: 'Unknown Owner', model: 'Unknown', color: 'Unknown', type: 'Unknown' };
        const violation = {
            id: generateId('VL'),
            vehicleReg: data.vehicleReg.toUpperCase(),
            zone: data.zone,
            description: data.description,
            ownerName: vehicle.owner,
            vehicleModel: vehicle.model,
            status: 'Reported',
            emailSent: true,
            rtoNotified: true,
            reportedAt: new Date().toISOString()
        };
        violations.push(violation);
        setStore(KEYS.VIOLATIONS, violations);
        return { violation, vehicle };
    }

    function getViolations() {
        return getStore(KEYS.VIOLATIONS);
    }

    // ─── Community Posts ───
    function createPost(data) {
        const posts = getStore(KEYS.COMMUNITY);
        const user = getUser();
        const post = {
            id: generateId('CP'),
            author: user ? user.name : 'Anonymous',
            locationName: data.locationName,
            address: data.address,
            type: data.type,
            priceEstimate: data.priceEstimate,
            availability: data.availability,
            rating: data.rating,
            description: data.description,
            upvotes: 0,
            downvotes: 0,
            createdAt: new Date().toISOString()
        };
        posts.unshift(post);
        setStore(KEYS.COMMUNITY, posts);
        return post;
    }

    function getPosts() {
        return getStore(KEYS.COMMUNITY);
    }

    function votePost(postId, direction) {
        const posts = getStore(KEYS.COMMUNITY);
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (direction === 'up') post.upvotes++;
            else post.downvotes++;
            setStore(KEYS.COMMUNITY, posts);
            return post;
        }
        return null;
    }

    // ─── Initialize default community posts ───
    function seedCommunityIfEmpty() {
        if (getPosts().length === 0) {
            const seeds = [
                { locationName: 'Cubbon Park Street Parking', address: 'Kasturba Road, Bangalore', type: 'Street', priceEstimate: '₹20/hr', availability: '6 AM - 10 PM', rating: 4, description: 'Great spot near the park entrance. Usually has space in the mornings. Well-lit and safe area.' },
                { locationName: 'Jayanagar 4th Block Lot', address: '4th Block, Jayanagar', type: 'Lot', priceEstimate: '₹30/hr', availability: '24/7', rating: 5, description: 'Excellent covered parking with CCTV. Friendly attendants. My go-to spot for weekend shopping!' },
                { locationName: 'Residency Road Open Space', address: 'Residency Road, Bangalore', type: 'Street', priceEstimate: '₹15/hr', availability: '8 AM - 8 PM', rating: 3, description: 'Decent spot but gets crowded after 5 PM. Park early if you can.' },
                { locationName: 'Private Garage - HSR Layout', address: 'Sector 2, HSR Layout', type: 'Private', priceEstimate: '₹50/hr', availability: '9 AM - 9 PM', rating: 4, description: 'My private garage space available for rent during work hours. Covered and secure.' },
            ];
            seeds.forEach(s => {
                const user = getUser();
                const post = {
                    id: generateId('CP'),
                    author: ['Rahul S.', 'Priya M.', 'Vikram K.', 'Deepa N.'][Math.floor(Math.random() * 4)],
                    ...s,
                    upvotes: Math.floor(Math.random() * 25) + 3,
                    downvotes: Math.floor(Math.random() * 3),
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
                };
                const posts = getStore(KEYS.COMMUNITY);
                posts.push(post);
                setStore(KEYS.COMMUNITY, posts);
            });
        }
    }

    // ─── Public API ───
    return {
        PARKING_LOTS,
        EVENTS,
        VEHICLES,
        NO_PARKING_ZONES,
        generateId,
        formatDate,
        formatTime,
        formatDateTime,
        calculateCost,
        signup,
        login,
        logout,
        isLoggedIn,
        getUser,
        createBooking,
        getBookings,
        cancelBooking,
        findVehicleBooking,
        initSlots,
        getSlots,
        updateSlotState,
        addGateLog,
        getGateLogs,
        reportViolation,
        getViolations,
        createPost,
        getPosts,
        votePost,
        seedCommunityIfEmpty
    };

})();
