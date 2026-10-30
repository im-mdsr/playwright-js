require('dotenv').config({ quiet: true });

// Defaults point at the public Toolshop and its published demo customer, so a fresh clone runs
// without a .env file. Override any value through .env or real environment variables.
module.exports = {
  baseUrl: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
  apiUrl: process.env.API_URL || 'https://api.practicesoftwaretesting.com',
  demo: {
    email: process.env.DEMO_EMAIL || 'customer@practicesoftwaretesting.com',
    password: process.env.DEMO_PASSWORD || 'welcome01',
  },
};
