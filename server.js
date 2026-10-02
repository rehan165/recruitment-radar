const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB Atlas
// Remember to replace <db_password> with your actual database user password
const dbURI = 'mongodb+srv://RehanShaikh:RehanAtlas2026@cluster0.728uwet.mongodb.net/recruitment_db?appName=Cluster0';

mongoose.connect(dbURI)
  .then(() => console.log('>>> Connected to MongoDB Atlas Successfully!'))
  .catch(err => console.error('>>> MongoDB Connection Error:', err));

// 2. Candidate Schema matching your registration form
const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    mno: String,
    ano: String,
    dob: String,
    cadd: String,
    padd: String,
    createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// 3. Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, pass, mno, ano, dob, cadd, padd } = req.body;

        const existing = await Candidate.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'This email is already registered!' });
        }

        const newCandidate = new Candidate({
            name,
            email: email.toLowerCase(),
            pass,
            mno,
            ano,
            dob,
            cadd,
            padd
        });

        await newCandidate.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error saving candidate' });
    }
});

// 4. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const user = await Candidate.findOne({ email: email.toLowerCase(), pass: pass });

        if (user) {
            res.status(200).json({ name: user.name, email: user.email });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// 5. Get All Candidates (For Admin Dashboard)
app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching candidates' });
    }
});

// 6. Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`>>> Backend Server running on http://localhost:${PORT}`);
});