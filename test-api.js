import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health check
    console.log('📋 Test 1: Health Check');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health:', health);
    console.log();

    // Test 2: Signup
    console.log('📋 Test 2: Signup');
    const testEmail = `user${Date.now()}@test.com`;
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: 'password123',
        currency: 'USD',
      }),
    });
    const signup = await signupRes.json();
    if (signupRes.ok) {
      console.log('✅ Signup success');
      console.log('   Token:', signup.token?.slice(0, 20) + '...');
      console.log('   User:', signup.user);
    } else {
      console.log('❌ Signup failed:', signup);
      return;
    }
    const token = signup.token;
    console.log();

    // Test 3: Get current user
    console.log('📋 Test 3: Get Current User (/api/auth/me)');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const me = await meRes.json();
    if (meRes.ok) {
      console.log('✅ Get user success:', me);
    } else {
      console.log('❌ Get user failed:', me);
    }
    console.log();

    // Test 4: Get portfolio
    console.log('📋 Test 4: Get Portfolio');
    const portfolioRes = await fetch(`${BASE_URL}/portfolio`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const portfolio = await portfolioRes.json();
    if (portfolioRes.ok) {
      console.log('✅ Get portfolio success');
      console.log('   Balance:', portfolio.balance);
      console.log('   Holdings count:', portfolio.holdings?.length);
      console.log('   Transactions count:', portfolio.transactions?.length);
    } else {
      console.log('❌ Get portfolio failed:', portfolio);
    }
    console.log();

    // Test 5: Get goals
    console.log('📋 Test 5: Get Goals');
    const goalsRes = await fetch(`${BASE_URL}/goals`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const goals = await goalsRes.json();
    if (goalsRes.ok) {
      console.log('✅ Get goals success');
      console.log('   Goals count:', Array.isArray(goals) ? goals.length : 0);
    } else {
      console.log('❌ Get goals failed:', goals);
    }
    console.log();

    // Test 6: Get watchlist
    console.log('📋 Test 6: Get Watchlist');
    const watchRes = await fetch(`${BASE_URL}/watchlist`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const watchlist = await watchRes.json();
    if (watchRes.ok) {
      console.log('✅ Get watchlist success');
      console.log('   Symbols:', Array.isArray(watchlist) ? watchlist : watchlist);
    } else {
      console.log('❌ Get watchlist failed:', watchlist);
    }
    console.log();

    console.log('✨ All tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAPI();
