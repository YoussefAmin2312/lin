const fs = require('fs');
let file = fs.readFileSync('src/components/header/Navigation.tsx', 'utf-8');

file = file.replace(/asset\("\/rings-collection\.png"\)/g, '"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800"');
file = file.replace(/asset\("\/homepic\.jpg"\)/g, '"https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=800"');
file = file.replace(/asset\("\/ring-aurora\.jpg"\)/g, '"https://images.unsplash.com/photo-1515562141207-7a8efd3f8cb1?auto=format&fit=crop&q=80&w=800"');
file = file.replace(/asset\("\/necklace-cosmos\.jpg"\)/g, '"https://images.unsplash.com/photo-1599643477874-510ee495aa97?auto=format&fit=crop&q=80&w=800"');
file = file.replace(/asset\("\/founders\.png"\)/g, '"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"');

fs.writeFileSync('src/components/header/Navigation.tsx', file);
