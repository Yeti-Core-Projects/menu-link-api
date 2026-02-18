/**
 * Script pour tester l'endpoint de seed en production
 * Usage: node test_seed_endpoint.js
 */

const https = require('https');

const BASE_URL = 'menu-link-api.onrender.com';

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Test des endpoints de seed...\n');

  // Test 1: Health check
  console.log('1️⃣ Test: GET /api/health');
  try {
    const health = await makeRequest('/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, JSON.stringify(health.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Erreur:`, error.message);
  }

  console.log('\n');

  // Test 2: Seed status
  console.log('2️⃣ Test: GET /api/seed/status');
  try {
    const status = await makeRequest('/api/seed/status');
    console.log(`   Status: ${status.status}`);
    console.log(`   Response:`, JSON.stringify(status.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Erreur:`, error.message);
  }

  console.log('\n');

  // Test 3: Seed database
  console.log('3️⃣ Test: POST /api/seed');
  try {
    const seed = await makeRequest('/api/seed', 'POST');
    console.log(`   Status: ${seed.status}`);
    console.log(`   Response:`, JSON.stringify(seed.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Erreur:`, error.message);
  }

  console.log('\n');

  // Test 4: Get menu
  console.log('4️⃣ Test: GET /api/menu');
  try {
    const menu = await makeRequest('/api/menu');
    console.log(`   Status: ${menu.status}`);
    if (menu.data.success) {
      console.log(`   ✅ Menu récupéré avec ${menu.data.data.totalDishes} plats`);
    } else {
      console.log(`   Response:`, JSON.stringify(menu.data, null, 2));
    }
  } catch (error) {
    console.log(`   ❌ Erreur:`, error.message);
  }

  console.log('\n✅ Tests terminés!');
}

testEndpoints();
