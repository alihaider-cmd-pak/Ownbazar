const fs = require('fs');
const path = require('path');

// Color options (hex codes)
const colorOptions = {
  Red: '#EF4444',
  Blue: '#3B82F6',
  Green: '#10B981',
  Black: '#1F2937',
  White: '#FFFFFF',
  Gray: '#9CA3AF',
  Yellow: '#FBBF24',
  Purple: '#9333EA',
  Pink: '#EC4899',
  Orange: '#F97316',
};

// Size options
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const productsPath = path.join(__dirname, 'data', 'products.json');

try {
  const raw = fs.readFileSync(productsPath, 'utf8');
  let products = JSON.parse(raw);

  // Add colors and sizes to each product
  products = products.map((product, index) => {
    return {
      ...product,
      colors: [
        colorOptions['Red'],
        colorOptions['Blue'],
        colorOptions['Black'],
      ],
      sizes: sizes,
      selectedColor: colorOptions['Red'],
      selectedSize: 'M',
    };
  });

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log('✅ Successfully updated ' + products.length + ' products with colors and sizes');
} catch (error) {
  console.error('❌ Error updating products:', error.message);
}
