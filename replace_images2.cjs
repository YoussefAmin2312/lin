const fs = require('fs');

const filePath = './src/data/products.ts';
let content = Object.assign('', fs.readFileSync(filePath, 'utf8'));

const images = [
  'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515562141207-7a8efd3f8cb1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1599643477874-510ee495aa97?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511253819057-013fa0bd57b6?auto=format&fit=crop&q=80&w=800'
];

let counter = 0;

// Match only inside the products array (lines after export const products)
let parts = content.split('export const products: Product[] = [');
let before = parts[0] + 'export const products: Product[] = [';
let after = parts[1];

after = after.replace(/    image: .*,/g, () => {
    let img = images[counter % images.length];
    counter++;
    return `    image: "${img}",`;
});

counter = 1;

after = after.replace(/    hoverImage: .*,/g, () => {
    let img = images[counter % images.length];
    counter++;
    return `    hoverImage: "${img}",`;
});

fs.writeFileSync(filePath, before + after);
console.log('Images replaced perfectly.');
