const http = require('http');
const fs = require('fs');
const path = require('path');

let results = [];

function makeRequest(method, path, body) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ success: true, status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ success: false, error: 'JSON Parse Error', raw: data });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  const log = (text) => {
    console.log(text);
    fs.appendFileSync('d:\\WorkSpace\\test-results.log', text + '\n');
  };

  log('🧪 AUTOMATED TEST SUITE STARTING...\n');

  const testCart = [{
    id: '1771071607988',
    name: 'Test Product',
    price: 1000,
    sku: '1000',
    category: 'Test',
    quantity: 1
  }];

  const shippingAddress = {
    fullName: 'Test User',
    email: 'test@test.com',
    phone: '03215865297',
    address: 'Test Address',
    city: 'Test City',
    state: 'Punjab',
    zipCode: '54000',
    country: 'Pakistan'
  };

  // TEST 1: COD Order
  log('📋 TEST 1: Creating COD Order...');
  const codOrder = {
    items: testCart,
    subtotal: 1000,
    tax: 100,
    total: 1100,
    paymentMethod: 'cod',
    shippingAddress
  };

  const cod = await makeRequest('POST', '/api/orders', codOrder);
  if (cod.success && cod.data.order) {
    log(`✅ COD order created: ${cod.data.order.orderNumber}`);
    results.push({ test: 'COD Order', status: 'PASS', order: cod.data.order.orderNumber });
  } else {
    log(`❌ COD order failed: ${cod.error}`);
    results.push({ test: 'COD Order', status: 'FAIL', error: cod.error });
  }

  // TEST 2: Bank Transfer with 2 Proofs
  log('\n📋 TEST 2: Creating Bank Transfer Order...');
  const bankOrder = {
    items: testCart,
    subtotal: 1500,
    tax: 150,
    total: 1650,
    paymentMethod: 'bank_transfer',
    shippingAddress
  };

  const bank = await makeRequest('POST', '/api/orders', bankOrder);
  let bankOrderId = null;
  if (bank.success && bank.data.order) {
    log(`✅ Bank order created: ${bank.data.order.orderNumber}`);
    results.push({ test: 'Bank Transfer Order', status: 'PASS', order: bank.data.order.orderNumber });
    bankOrderId = bank.data.order.id;

    // Upload 2 proofs
    log('📸 Uploading 2 payment proofs...');
    const proof = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const proofPayload = {
      orderId: bankOrderId,
      proofs: [`data:image/png;base64,${proof}`, `data:image/png;base64,${proof}`]
    };

    const proofRes = await makeRequest('POST', '/api/orders/payment-proof', proofPayload);
    if (proofRes.success) {
      log('✅ 2 Proofs uploaded');
      results.push({ test: 'Bank Transfer + 2 Proofs', status: 'PASS' });
    } else {
      log(`⚠️ Proof upload failed: ${proofRes.error}`);
      results.push({ test: 'Bank Transfer + Proofs', status: 'FAIL', error: proofRes.error });
    }
  } else {
    log(`❌ Bank order failed: ${bank.error}`);
    results.push({ test: 'Bank Transfer Order', status: 'FAIL', error: bank.error });
  }

  // TEST 3: Easypaisa with 3 Proofs
  log('\n📋 TEST 3: Creating Easypaisa Order...');
  const easyOrder = {
    items: testCart,
    subtotal: 2000,
    tax: 200,
    total: 2200,
    paymentMethod: 'easypaisa',
    shippingAddress
  };

  const easy = await makeRequest('POST', '/api/orders', easyOrder);
  let easyOrderId = null;
  if (easy.success && easy.data.order) {
    log(`✅ Easypaisa order created: ${easy.data.order.orderNumber}`);
    results.push({ test: 'Easypaisa Order', status: 'PASS', order: easy.data.order.orderNumber });
    easyOrderId = easy.data.order.id;

    // Upload 3 proofs
    log('📸 Uploading 3 payment proofs...');
    const proof = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const proofPayload = {
      orderId: easyOrderId,
      proofs: [
        `data:image/png;base64,${proof}`,
        `data:image/png;base64,${proof}`,
        `data:image/png;base64,${proof}`
      ]
    };

    const proofRes = await makeRequest('POST', '/api/orders/payment-proof', proofPayload);
    if (proofRes.success) {
      log('✅ 3 Proofs uploaded');
      results.push({ test: 'Easypaisa + 3 Proofs', status: 'PASS' });
    } else {
      log(`⚠️ Proof upload failed: ${proofRes.error}`);
      results.push({ test: 'Easypaisa + Proofs', status: 'FAIL', error: proofRes.error });
    }
  } else {
    log(`❌ Easypaisa order failed: ${easy.error}`);
    results.push({ test: 'Easypaisa Order', status: 'FAIL', error: easy.error });
  }

  // TEST 4: JazzCash Order
  log('\n📋 TEST 4: Creating JazzCash Order...');
  const jazzOrder = {
    items: testCart,
    subtotal: 2500,
    tax: 250,
    total: 2750,
    paymentMethod: 'jazzcash',
    shippingAddress
  };

  const jazz = await makeRequest('POST', '/api/orders', jazzOrder);
  if (jazz.success && jazz.data.order) {
    log(`✅ JazzCash order created: ${jazz.data.order.orderNumber}`);
    results.push({ test: 'JazzCash Order', status: 'PASS', order: jazz.data.order.orderNumber });
  } else {
    log(`❌ JazzCash order failed: ${jazz.error}`);
    results.push({ test: 'JazzCash Order', status: 'FAIL', error: jazz.error });
  }

  // TEST 5: Verify data integrity
  log('\n📋 TEST 5: Verifying data/orders.json...');
  try {
    const orders = JSON.parse(fs.readFileSync('d:\\WorkSpace\\data\\orders.json', 'utf-8'));
    const totalOrders = Array.isArray(orders) ? orders.length : 1;
    log(`✅ Orders file readable - Total: ${totalOrders} orders`);
    
    // Find our test orders
    const lastOrders = Array.isArray(orders) ? orders.slice(-4) : [orders];
    log('\n📊 Last 4 orders:');
    lastOrders.forEach(o => {
      const proofs = Array.isArray(o.paymentProof) ? o.paymentProof.length : (o.paymentProof ? 1 : 0);
      log(`   ${o.orderNumber} | ${o.paymentMethod?.toUpperCase() || 'null'} | Proofs: ${proofs}`);
    });
    
    results.push({ test: 'Data Integrity', status: 'PASS', totalOrders });
  } catch (err) {
    log(`❌ Data check failed: ${err.message}`);
    results.push({ test: 'Data Integrity', status: 'FAIL', error: err.message });
  }

  // SUMMARY
  log('\n\n═══════════════════════════════════════════════════════════');
  log('                    📊 TEST SUMMARY');
  log('═══════════════════════════════════════════════════════════\n');

  results.forEach(r => {
    const badge = r.status === 'PASS' ? '✅' : '❌';
    log(`${badge} ${r.test}: ${r.status}`);
    if (r.order) log(`   Order: ${r.order}`);
    if (r.error) log(`   Error: ${r.error}`);
  });

  const passed = results.filter(r => r.status === 'PASS').length;
  log(`\n✅ PASSED: ${passed}/${results.length}`);
  log('═══════════════════════════════════════════════════════════\n');
  log('Test complete! Results saved to test-results.log');
}

// Clear previous results
fs.writeFileSync('d:\\WorkSpace\\test-results.log', '');
runTests().catch(err => {
  console.error('Test error:', err);
  fs.appendFileSync('d:\\WorkSpace\\test-results.log', `FATAL ERROR: ${err.message}\n`);
});
