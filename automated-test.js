const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = [];

// Helper to make API calls
async function makeRequest(method, endpoint, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Generate test proof image (small base64 PNG)
function generateTestProof() {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}

async function runTests() {
  console.log('🧪 AUTOMATED TEST SUITE STARTING...\n');

  // TEST DATA - choose a real product from data/products.json when available
  let testCart;
  try {
    const productsFile = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8');
    const products = JSON.parse(productsFile);
    const p = products && products.length ? products[0] : null;
    if (p) {
      testCart = [
        {
          id: p.id,
          name: p.name || 'Test Product',
          price: p.price || 1000,
          sku: p.sku || p.id,
          category: p.category || 'General',
          quantity: 1,
        },
      ];
    } else {
      testCart = [
        {
          id: '1771071607988',
          name: 'Test Product 1',
          price: 1000,
          sku: '1000',
          category: 'Fashion And Beauty',
          quantity: 1,
        },
      ];
    }
  } catch (err) {
    testCart = [
      {
        id: '1771071607988',
        name: 'Test Product 1',
        price: 1000,
        sku: '1000',
        category: 'Fashion And Beauty',
        quantity: 1,
      },
    ];
  }

  const shippingAddress = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '03215865297',
    address: 'Test Address',
    city: 'Test City',
    state: 'Punjab',
    zipCode: '54000',
    country: 'Pakistan',
  };

  // ============ TEST 1: COD Order ============
  console.log('📋 TEST 1: Creating COD Order...');
  const codOrder = {
    items: testCart,
    subtotal: 1000,
    tax: 100,
    shipping: 0,
    total: 1100,
    paymentMethod: 'cod',
    shippingAddress,
  };

  const cod1 = await makeRequest('POST', '/api/orders', codOrder);
  if (cod1.success) {
    const orderId1 = cod1.data.order?.id;
    const orderNum1 = cod1.data.order?.orderNumber;
    TEST_RESULTS.push({
      test: 'COD Order',
      status: '✅ PASS',
      orderId: orderId1,
      orderNumber: orderNum1,
      paymentMethod: 'cod',
      proofs: 'N/A (COD)',
    });
    console.log('✅ COD order created: ' + orderNum1);
  } else {
    TEST_RESULTS.push({ test: 'COD Order', status: '❌ FAIL', error: cod1.error });
    console.log('❌ COD order failed: ' + cod1.error);
  }

  // ============ TEST 2: Bank Transfer Order with 2 Proofs ============
  console.log('\n📋 TEST 2: Creating Bank Transfer Order with 2 proofs...');
  const bankOrder = {
    items: testCart,
    subtotal: 1500,
    tax: 150,
    shipping: 0,
    total: 1650,
    paymentMethod: 'bank_transfer',
    shippingAddress,
  };

  const bank1 = await makeRequest('POST', '/api/orders', bankOrder);
  if (bank1.success) {
    const orderId2 = bank1.data.order?.id;
    const orderNum2 = bank1.data.order?.orderNumber;
    console.log('✅ Bank order created: ' + orderNum2);

    // Upload 2 proofs
    console.log('📸 Uploading 2 payment proofs...');
    const proofPayload = {
      orderId: orderId2,
      proofs: [generateTestProof(), generateTestProof()],
    };

    const proofRes = await makeRequest('POST', '/api/orders/payment-proof', proofPayload);
    if (proofRes.success) {
      TEST_RESULTS.push({
        test: 'Bank Transfer + 2 Proofs',
        status: '✅ PASS',
        orderId: orderId2,
        orderNumber: orderNum2,
        paymentMethod: 'bank_transfer',
        proofs: 2,
      });
      console.log('✅ Proofs uploaded successfully');
    } else {
      TEST_RESULTS.push({
        test: 'Bank Transfer + 2 Proofs',
        status: '⚠️ ORDER OK, PROOF FAILED',
        orderId: orderId2,
        error: proofRes.error,
      });
      console.log('⚠️ Proof upload failed: ' + proofRes.error);
    }
  } else {
    TEST_RESULTS.push({ test: 'Bank Transfer Order', status: '❌ FAIL', error: bank1.error });
    console.log('❌ Bank order failed: ' + bank1.error);
  }

  // ============ TEST 3: Easypaisa Order with 3 Proofs ============
  console.log('\n📋 TEST 3: Creating Easypaisa Order with 3 proofs...');
  const easyOrder = {
    items: testCart,
    subtotal: 2000,
    tax: 200,
    shipping: 0,
    total: 2200,
    paymentMethod: 'easypaisa',
    shippingAddress,
  };

  const easy1 = await makeRequest('POST', '/api/orders', easyOrder);
  if (easy1.success) {
    const orderId3 = easy1.data.order?.id;
    const orderNum3 = easy1.data.order?.orderNumber;
    console.log('✅ Easypaisa order created: ' + orderNum3);

    // Upload 3 proofs
    console.log('📸 Uploading 3 payment proofs...');
    const proofPayload = {
      orderId: orderId3,
      proofs: [generateTestProof(), generateTestProof(), generateTestProof()],
    };

    const proofRes = await makeRequest('POST', '/api/orders/payment-proof', proofPayload);
    if (proofRes.success) {
      TEST_RESULTS.push({
        test: 'Easypaisa + 3 Proofs',
        status: '✅ PASS',
        orderId: orderId3,
        orderNumber: orderNum3,
        paymentMethod: 'easypaisa',
        proofs: 3,
      });
      console.log('✅ 3 Proofs uploaded successfully');
    } else {
      TEST_RESULTS.push({
        test: 'Easypaisa + 3 Proofs',
        status: '⚠️ ORDER OK, PROOF FAILED',
        orderId: orderId3,
        error: proofRes.error,
      });
      console.log('⚠️ Proof upload failed: ' + proofRes.error);
    }
  } else {
    TEST_RESULTS.push({ test: 'Easypaisa Order', status: '❌ FAIL', error: easy1.error });
    console.log('❌ Easypaisa order failed: ' + easy1.error);
  }

  // ============ TEST 4: Verify Data Integrity ============
  console.log('\n📋 TEST 4: Verifying data in data/orders.json...');
  try {
    const ordersFile = fs.readFileSync('d:\\WorkSpace\\data\\orders.json', 'utf-8');
    const orders = JSON.parse(ordersFile);
    const lastThree = orders.slice(-3);

    console.log('✅ JSON file readable and valid');
    console.log('\n📊 Last 3 Created Orders:');
    lastThree.forEach((order, idx) => {
      const proofCount = Array.isArray(order.paymentProof) 
        ? order.paymentProof.length 
        : (order.paymentProof ? 1 : 0);
      console.log(`   ${idx + 1}. ${order.orderNumber} - ${order.paymentMethod?.toUpperCase()} - ${proofCount} proof(s)`);
    });

    TEST_RESULTS.push({
      test: 'Data Integrity Check',
      status: '✅ PASS',
      totalOrders: orders.length,
      lastThreeVisible: true,
    });
  } catch (error) {
    TEST_RESULTS.push({
      test: 'Data Integrity Check',
      status: '❌ FAIL',
      error: error.message,
    });
    console.log('❌ File error: ' + error.message);
  }

  // ============ SUMMARY ============
  console.log('\n\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  TEST_RESULTS.forEach(result => {
    console.log(`${result.status} ${result.test}`);
    if (result.orderId) console.log(`   Order ID: ${result.orderId}`);
    if (result.orderNumber) console.log(`   Order #: ${result.orderNumber}`);
    if (result.proofs !== undefined && result.proofs !== 'N/A (COD)') console.log(`   Proofs: ${result.proofs}`);
    if (result.error) console.log(`   Error: ${result.error}`);
  });

  const passed = TEST_RESULTS.filter(r => r.status.includes('✅')).length;
  const total = TEST_RESULTS.length;
  console.log(`\n\n✅ PASSED: ${passed}/${total}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(console.error);
