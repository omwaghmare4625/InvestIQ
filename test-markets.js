const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxNzc0OTg4MjI0NTcyQHRlc3QuY29tIiwiaWF0IjoxNzM2MzAyNzAwfQ.jXRbZVnqJ7N7K4L3m2K3M3n4O4P5Q5R5S5T5U5V5W5';

fetch('http://localhost:5000/api/markets', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(e => console.error('Error:', e.message));
