const BASE_URL = import.meta.env.VITE_API_URL || "https://staresevaimaiyam.onrender.com";

fetch(`${BASE_URL}/api/can/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: userName.trim(),
    canNumber: canNumber.trim()
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));
