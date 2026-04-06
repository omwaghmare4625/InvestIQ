// Create a truly new account to trigger fresh API calls
const email = `testuser${Date.now()}@example.com`;

fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User ' + Date.now(),
    email: email,
    password: 'testpass123'
  })
})
  .then(r => r.json())
  .then(data => {
    console.log('Signup response:', JSON.stringify(data, null, 2));
    
    if (data.token) {
      // Now test markets endpoint with this token
      return fetch('http://localhost:5000/api/markets', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
    }
  })
  .then(r => r?.json())
  .then(d => {
    if (d) {
      console.log('\nMarkets response (count):', d.length);
      d.forEach(m => console.log(`- ${m.symbol}: $${m.price}`));
    }
  })
  .catch(e => console.error('Error:', e.message));
