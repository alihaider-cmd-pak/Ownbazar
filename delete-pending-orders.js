const fs = require('fs');
const path = require('path');

try {
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  const content = fs.readFileSync(ordersPath, 'utf8');
  const orders = JSON.parse(content);
  
  console.log('Total orders before:', orders.length);
  
  const filtered = orders.filter(order => order.status !== 'PENDING');
  
  const removed = orders.length - filtered.length;
  console.log('Pending orders removed:', removed);
  console.log('Total orders after:', filtered.length);
  
  fs.writeFileSync(ordersPath, JSON.stringify(filtered, null, 2), 'utf8');
  console.log('✓ Successfully deleted all pending orders!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
