// Helper to extract cookie values from set-cookie headers
function extractRefreshToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith('refreshToken=')) {
      return trimmed.split('=')[1];
    }
  }
  return null;
}

async function runTest() {
  console.log('=== Authentication Sequence Test ===\n');

  const BASE_URL = 'http://localhost:5000/api/v1';
  let refreshToken: string | null = null;
  let accessToken: string | null = null;

  // 1. LOGIN
  try {
    console.log('1. Initiating LOGIN for student@college.edu...');
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@college.edu',
        password: 'password123',
      }),
    });
    console.log('Response Status:', res.status);
    const body = await res.json() as any;
    if (res.status !== 200) {
      console.error('❌ Login failed:', body);
      return;
    }
    accessToken = body.data.accessToken;
    const cookieHeader = res.headers.get('set-cookie');
    refreshToken = extractRefreshToken(cookieHeader);
    console.log('✅ Access Token acquired (Truncated):', accessToken?.substring(0, 30) + '...');
    console.log('✅ Refresh Token Cookie acquired (Truncated):', refreshToken?.substring(0, 30) + '...\n');
  } catch (err: any) {
    console.error('❌ Login error:', err.message);
    return;
  }

  // 2. REFRESH 1
  try {
    console.log('2. Initiating REFRESH 1...');
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      body: JSON.stringify({ refreshToken })
    });
    console.log('Response Status:', res.status);
    const body = await res.json() as any;
    if (res.status !== 200) {
      console.error('❌ Refresh 1 failed:', body);
      return;
    }
    accessToken = body.data.accessToken;
    const cookieHeader = res.headers.get('set-cookie');
    refreshToken = extractRefreshToken(cookieHeader) || refreshToken;
    console.log('✅ Access Token refreshed (Truncated):', accessToken?.substring(0, 30) + '...');
    console.log('✅ New Refresh Token Cookie acquired (Truncated):', refreshToken?.substring(0, 30) + '...\n');
  } catch (err: any) {
    console.error('❌ Refresh 1 error:', err.message);
    return;
  }

  // 3. REFRESH 2
  try {
    console.log('3. Initiating REFRESH 2...');
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      body: JSON.stringify({ refreshToken })
    });
    console.log('Response Status:', res.status);
    const body = await res.json() as any;
    if (res.status !== 200) {
      console.error('❌ Refresh 2 failed:', body);
      return;
    }
    accessToken = body.data.accessToken;
    const cookieHeader = res.headers.get('set-cookie');
    refreshToken = extractRefreshToken(cookieHeader) || refreshToken;
    console.log('✅ Access Token refreshed (Truncated):', accessToken?.substring(0, 30) + '...');
    console.log('✅ New Refresh Token Cookie acquired (Truncated):', refreshToken?.substring(0, 30) + '...\n');
  } catch (err: any) {
    console.error('❌ Refresh 2 error:', err.message);
    return;
  }

  // 4. LOGOUT
  try {
    console.log('4. Initiating LOGOUT...');
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      body: JSON.stringify({ refreshToken })
    });
    console.log('Response Status:', res.status);
    const body = await res.json() as any;
    if (res.status !== 200) {
      console.error('❌ Logout failed:', body);
      return;
    }
    console.log('✅ Logout Message:', body.message, '\n');
  } catch (err: any) {
    console.error('❌ Logout error:', err.message);
    return;
  }

  // 5. REFRESH (SHOULD FAIL)
  try {
    console.log('5. Initiating REFRESH post-logout (should be rejected)...');
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      body: JSON.stringify({ refreshToken })
    });
    const body = await res.json() as any;
    if (res.status === 200) {
      console.error('❌ Error: Refresh succeeded after logout (this should not happen).');
    } else {
      console.log('✅ Expected Failure: Refresh rejected after logout!');
      console.log('Status code:', res.status);
      console.log('Error Message:', body.message);
    }
  } catch (err: any) {
    console.error('❌ Unexpected error in rejection verification:', err.message);
  }
}

runTest();
