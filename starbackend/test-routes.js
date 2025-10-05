const axios = require('axios');

const BASE_URL = 'https://staresevaimaiyam.onrender.com';

async function testRoutes() {
  try {
    console.log('Testing server connectivity...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test root endpoint
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', rootResponse.data);
    
    // Test admin endpoint existence
    try {
      const adminResponse = await axios.get(`${BASE_URL}/api/admin`);
      console.log('✅ Admin endpoint:', adminResponse.data);
    } catch (error) {
      console.log('ℹ️  Admin endpoint may not have GET method (this is normal)');
    }
    
    console.log('\n🎯 Server is running correctly!');
    console.log('📝 Available admin endpoints:');
    console.log('   POST /api/admin/signin');
    console.log('   GET /api/admin/profile');
    console.log('   POST /api/admin/verify-password');
    console.log('   PUT /api/admin/update');
    
  } catch (error) {
    console.error('❌ Error testing routes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testRoutes();