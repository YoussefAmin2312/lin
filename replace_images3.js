import fs from 'fs';

const filePath = './src/data/products.ts';
let content = fs.readFileSync(filePath, 'utf8');

const images = [
  'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515562141207-7a8efd3f8cb1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1599643477874-510ee495aa97?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511253819057-013fa0bd57b6?auto=format&fit=crop&q=80&w=800'
];

let counter = 0;
let counterHover = 1;

content = content.replace(/(?<=    )image: .*,/g, () => {
    let img = images[counter % images.length];
    counter++;
    return `image: "${img}",`;
});

content = content.replace(/(?<=    )hoverImage: .*,/g, () => {
    let img = images[counterHover % images.length];
    counterHover++;
    return `hoverImage: "${img}",`;
});

fs.writeFileSync(filePath, content);
console.log('Images replaced perfectly.');
