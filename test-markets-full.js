// First login to get a valid token
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'testuser@example.com',
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
      console.log('\nMarkets response:', JSON.stringify(d, null, 2));
    }
  })
  .catch(e => console.error('Error:', e.message));
