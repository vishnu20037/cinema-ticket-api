const express = require('express');
const mongoose = require('mongoose');
// Create Express app
const app = express();
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cinema_ticket_api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Cinema schema
const cinemaSchema = new mongoose.Schema({
  seats: {
    type: Number,
    required: true,
  },
  purchasedSeats: {
    type: [Number],
    default: [],
  },
});

// Define the Cinema model
const Cinema = mongoose.model('Cinema', cinemaSchema);

// Create a new cinema with N seats
app.post('/cinemas', async (req, res) => {
  const { seats } = req.body;
  try {
    const cinema = await Cinema.create({ seats });
    res.json({ cinemaId: cinema._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Purchase a specific seat number in cinema C
app.post('/cinemas/:cinemaId/purchase/:seatNumber', async (req, res) => {
    const { cinemaId, seatNumber } = req.params;
    try {
      const cinema = await Cinema.findById(cinemaId);
      if (!cinema) {
        return res.status(404).json({ error: 'Cinema not found' });
      }
  
      const parsedSeatNumber = Number(seatNumber);
      if (isNaN(parsedSeatNumber) || parsedSeatNumber <= 0 || parsedSeatNumber > cinema.seats) {
        return res.status(400).json({ error: 'Invalid seat number' });
      }
  
      if (cinema.purchasedSeats.includes(parsedSeatNumber)) {
        return res.status(400).json({ error: 'Seat already purchased' });
      }
  
      cinema.purchasedSeats.push(parsedSeatNumber);
      await cinema.save();
      res.json({ seat: parsedSeatNumber });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  

// Purchase the first two free consecutive seats in cinema C
app.post('/cinemas/:cinemaId/purchaseConsecutive', async (req, res) => {
  const { cinemaId } = req.params;
  try {
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    const seats = cinema.seats;
    const purchasedSeats = new Set(cinema.purchasedSeats);

    let consecutiveSeats = [];
    let count = 0;

    for (let i = 1; i <= seats; i++) {
      if (!purchasedSeats.has(i)) {
        consecutiveSeats.push(i);
        count++;
      } else {
        consecutiveSeats = [];
        count = 0;
      }

      if (count === 2) {
        break;
      }
    }

    if (count === 2) {
      for (let i = 0; i < 2; i++) {
        cinema.purchasedSeats.push(consecutiveSeats[i]);
      }
      await cinema.save();
      res.json({ seats: consecutiveSeats });
    } else {
      res.status(400).json({ error: 'No two consecutive seats available' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
