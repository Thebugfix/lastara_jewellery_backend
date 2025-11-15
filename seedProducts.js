// ============================================
// FILE: backend/scripts/seedProducts.js
// Seed script for sample jewelry products
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Function to generate slug from title
function generateSlug(title, sku) {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove hyphens from start and end
  
  // Add SKU to slug to ensure uniqueness
  if (sku) {
    slug = `${slug}-${sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  } else {
    // If no SKU, add a random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    slug = `${slug}-${randomSuffix}`;
  }
  
  return slug;
}

// Sample products data
const sampleProducts = [
  // ========== NECKLACES ==========
  {
    title: 'Adhvita Diamond Necklace',
    sku: 'NECK-DIA-001',
    description: 'Like scattered stars, they twinkle, twirl and glide. Glowing fireflies, guiding the night with glowing pride. Wear this studded necklace inspired by the night sky and let your elegance shine through.',
    purity: '18K',
    weight: 33.174,
    pricePerGram: 6200,
    category: 'Necklaces',
    material: 'Diamond',
    occasion: 'Special Events',
    weddingType: 'Bridal Sets',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        public_id: 'sample_neck_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        public_id: 'sample_neck_1_2'
      }
    ]
  },
  {
    title: 'Traditional Gold Necklace',
    sku: 'NECK-GLD-002',
    description: 'Exquisite traditional gold necklace featuring intricate craftsmanship. Perfect for weddings and special occasions. This timeless piece showcases the rich heritage of Indian jewelry making.',
    purity: '22K',
    weight: 45.5,
    pricePerGram: 6000,
    category: 'Necklaces',
    material: 'Gold',
    occasion: 'Festive',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800',
        public_id: 'sample_neck_2'
      },
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        public_id: 'sample_neck_2_2'
      }
    ]
  },
  {
    title: 'Pearl Strand Necklace',
    sku: 'NECK-PRL-003',
    description: 'Elegant pearl necklace with lustrous pearls strung together in perfect harmony. Ideal for both traditional and modern attire. A symbol of timeless elegance and sophistication.',
    purity: '22K',
    weight: 28.3,
    pricePerGram: 5800,
    category: 'Necklaces',
    material: 'Pearl',
    occasion: 'Daily Wear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
        public_id: 'sample_neck_3'
      }
    ]
  },
  {
    title: 'Temple Design Gold Necklace',
    sku: 'NECK-TMP-004',
    description: 'Divine temple jewelry inspired necklace featuring goddess motifs and intricate temple architecture designs. Crafted with devotion and traditional artistry.',
    purity: '22K',
    weight: 52.8,
    pricePerGram: 6100,
    category: 'Necklaces',
    material: 'Gold',
    occasion: 'Festive',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
        public_id: 'sample_neck_4'
      }
    ]
  },

  // ========== EARRINGS ==========
  {
    title: 'Diamond Stud Earrings',
    sku: 'EARR-DIA-001',
    description: 'Classic diamond studs that add sparkle to any occasion. SI-FG quality diamonds set in 18K gold. Perfect everyday luxury accessory.',
    purity: '18K',
    weight: 4.2,
    pricePerGram: 6500,
    category: 'Earrings',
    material: 'Diamond',
    occasion: 'Daily Wear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f0e?w=800',
        public_id: 'sample_earr_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
        public_id: 'sample_earr_1_2'
      }
    ]
  },
  {
    title: 'Gold Jhumka Earrings',
    sku: 'EARR-JHU-002',
    description: 'Traditional Indian jhumka earrings with intricate gold work and temple design. Features delicate ghungroo detailing. A must-have for festive occasions.',
    purity: '22K',
    weight: 12.5,
    pricePerGram: 5900,
    category: 'Earrings',
    material: 'Gold',
    occasion: 'Festive',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        public_id: 'sample_earr_2'
      }
    ]
  },
  {
    title: 'Pearl Drop Earrings',
    sku: 'EARR-PRL-003',
    description: 'Graceful pearl drop earrings with gold accents. Sophisticated design perfect for formal events. Combines modern elegance with traditional charm.',
    purity: '18K',
    weight: 6.8,
    pricePerGram: 6200,
    category: 'Earrings',
    material: 'Pearl',
    occasion: 'Formal',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596944924591-4cc082e3e5ad?w=800',
        public_id: 'sample_earr_3'
      }
    ]
  },
  {
    title: 'Chandbali Earrings',
    sku: 'EARR-CHA-004',
    description: 'Crescent moon shaped chandbali earrings with intricate filigree work. Features colorful gemstone accents. Perfect for weddings and celebrations.',
    purity: '22K',
    weight: 15.3,
    pricePerGram: 6000,
    category: 'Earrings',
    material: 'Gold',
    occasion: 'Wedding',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        public_id: 'sample_earr_4'
      }
    ]
  },

  // ========== RINGS ==========
  {
    title: 'Solitaire Diamond Ring',
    sku: 'RING-DIA-001',
    description: 'Stunning solitaire diamond ring with a brilliant cut center stone. Classic engagement ring design that never goes out of style. Certified diamond with excellent clarity.',
    purity: '18K',
    weight: 3.5,
    pricePerGram: 7000,
    category: 'Rings',
    material: 'Diamond',
    occasion: 'Special Events',
    weddingType: 'Engagement Rings',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        public_id: 'sample_ring_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        public_id: 'sample_ring_1_2'
      }
    ]
  },
  {
    title: 'Gold Band Ring',
    sku: 'RING-BND-002',
    description: 'Simple yet elegant gold band ring. Perfect for daily wear or as a wedding band. Comfortable fit with smooth finish.',
    purity: '22K',
    weight: 4.8,
    pricePerGram: 5800,
    category: 'Rings',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        public_id: 'sample_ring_2'
      }
    ]
  },
  {
    title: 'Emerald Stone Ring',
    sku: 'RING-EME-003',
    description: 'Vibrant emerald stone ring surrounded by small diamonds. Royal and luxurious design perfect for special occasions. Natural emerald with rich green color.',
    purity: '18K',
    weight: 5.2,
    pricePerGram: 6800,
    category: 'Rings',
    material: 'Emerald',
    occasion: 'Special Events',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
        public_id: 'sample_ring_3'
      }
    ]
  },

  // ========== BANGLES ==========
  {
    title: 'Gold Kada Bangle',
    sku: 'BANG-KDA-001',
    description: 'Traditional solid gold kada with intricate patterns. Symbol of strength and prosperity. Ideal for both men and women.',
    purity: '22K',
    weight: 38.5,
    pricePerGram: 5900,
    category: 'Bangles',
    material: 'Gold',
    occasion: 'Festive',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        public_id: 'sample_bang_1'
      }
    ]
  },
  {
    title: 'Diamond Bangle Pair',
    sku: 'BANG-DIA-002',
    description: 'Exquisite pair of diamond bangles with channel-set diamonds. Contemporary design with traditional appeal. Perfect for special occasions.',
    purity: '18K',
    weight: 42.0,
    pricePerGram: 6400,
    category: 'Bangles',
    material: 'Diamond',
    occasion: 'Special Events',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        public_id: 'sample_bang_2'
      }
    ]
  },
  {
    title: 'Antique Gold Bangles Set',
    sku: 'BANG-ANT-003',
    description: 'Set of 4 antique finish gold bangles with traditional motifs. Perfect for festive occasions and celebrations. Timeless design passed through generations.',
    purity: '22K',
    weight: 68.4,
    pricePerGram: 6000,
    category: 'Bangles',
    material: 'Gold',
    occasion: 'Festive',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800',
        public_id: 'sample_bang_3'
      }
    ]
  },

  // ========== BRACELETS ==========
  {
    title: 'Gold Chain Bracelet',
    sku: 'BRAC-CHN-001',
    description: 'Delicate gold chain bracelet perfect for everyday elegance. Lightweight and comfortable design. Versatile accessory for any outfit.',
    purity: '18K',
    weight: 8.2,
    pricePerGram: 6100,
    category: 'Bracelets',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        public_id: 'sample_brac_1'
      }
    ]
  },
  {
    title: 'Diamond Tennis Bracelet',
    sku: 'BRAC-TEN-002',
    description: 'Classic tennis bracelet featuring perfectly matched diamonds. Flexible design for comfortable wear. A symbol of timeless luxury.',
    purity: '18K',
    weight: 12.5,
    pricePerGram: 7200,
    category: 'Bracelets',
    material: 'Diamond',
    occasion: 'Special Events',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
        public_id: 'sample_brac_2'
      }
    ]
  },
  {
    title: 'Charm Bracelet',
    sku: 'BRAC-CHR-003',
    description: 'Personalized charm bracelet with gold charms. Add your favorite charms to create a unique piece. Perfect gift for loved ones.',
    purity: '22K',
    weight: 10.8,
    pricePerGram: 5900,
    category: 'Bracelets',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        public_id: 'sample_brac_3'
      }
    ]
  },

  // ========== PENDANTS ==========
  {
    title: 'Diamond Pendant',
    sku: 'PEND-DIA-001',
    description: 'Elegant diamond pendant with white gold chain. Simple yet stunning design. Perfect for gifting or personal collection.',
    purity: '18K',
    weight: 4.5,
    pricePerGram: 6800,
    category: 'Pendants',
    material: 'Diamond',
    occasion: 'Special Events',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        public_id: 'sample_pend_1'
      }
    ]
  },
  {
    title: 'Om Pendant',
    sku: 'PEND-OM-002',
    description: 'Sacred Om symbol pendant in pure gold. Spiritual jewelry for daily wear. Brings peace and positive energy.',
    purity: '22K',
    weight: 6.2,
    pricePerGram: 6000,
    category: 'Pendants',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800',
        public_id: 'sample_pend_2'
      }
    ]
  }
  ,
  // ========== ADDITIONAL CATEGORIES TO MATCH NAVBAR ==========
  {
    title: 'Traditional Maharashtrian Nath',
    sku: 'NATH-GLD-001',
    description: 'Classic Maharashtrian nose ring with pearl detailing.',
    purity: '22K',
    weight: 2.1,
    pricePerGram: 6000,
    category: 'Naths',
    material: 'Gold',
    occasion: 'Festive',
    images: [{ url: 'https://images.unsplash.com/photo-1581783344794-8f1b56fe8d2d?w=800', public_id: 'sample_nath_1' }]
  },
  {
    title: 'Gold Bindiya Headpiece',
    sku: 'BIND-GLD-001',
    description: 'Elegant forehead bindiya with minimal design.',
    purity: '22K',
    weight: 3.4,
    pricePerGram: 5900,
    category: 'Bindiya',
    material: 'Gold',
    occasion: 'Wedding',
    images: [{ url: 'https://images.unsplash.com/photo-1520975922284-8b456906c813?w=800', public_id: 'sample_bindiya_1' }]
  },
  {
    title: 'Traditional Vati Necklace',
    sku: 'VATI-GLD-001',
    description: 'Vati style traditional gold necklace.',
    purity: '22K',
    weight: 24.0,
    pricePerGram: 6000,
    category: 'Vati',
    material: 'Gold',
    occasion: 'Festive',
    images: [{ url: 'https://images.unsplash.com/photo-1520967460892-c0d41d6a2e86?w=800', public_id: 'sample_vati_1' }]
  },
  {
    title: 'Heritage Jhumka',
    sku: 'JHUM-GLD-001',
    description: 'Traditional bell-shaped jhumka earrings.',
    purity: '22K',
    weight: 11.2,
    pricePerGram: 6000,
    category: 'Jhumka',
    material: 'Gold',
    occasion: 'Festive',
    images: [{ url: 'https://images.unsplash.com/photo-1585386959984-a41552231656?w=800', public_id: 'sample_jhumka_cat_1' }]
  },
  {
    title: 'Kaan Chain Ear Accessory',
    sku: 'KAAN-GLD-001',
    description: 'Delicate ear-to-hair kaan chain accessory.',
    purity: '22K',
    weight: 5.3,
    pricePerGram: 6000,
    category: 'Kaan Chain',
    material: 'Gold',
    occasion: 'Wedding',
    images: [{ url: 'https://images.unsplash.com/photo-1560130950-10f019eb1d58?w=800', public_id: 'sample_kaan_chain_1' }]
  },
  {
    title: 'Classic Gold Chain',
    sku: 'CHAIN-GLD-001',
    description: 'Everyday wear gold chain with smooth finish.',
    purity: '22K',
    weight: 14.8,
    pricePerGram: 5950,
    category: 'Chains',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1611591437244-46e6d73b52da?w=800', public_id: 'sample_chain_1' }]
  },
  {
    title: 'Laxmi Haar Temple Necklace',
    sku: 'LXMH-GLD-001',
    description: 'Temple-inspired Laxmi Haar with deity motifs.',
    purity: '22K',
    weight: 62.5,
    pricePerGram: 6000,
    category: 'Laxmi Haar',
    material: 'Gold',
    occasion: 'Festive',
    images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', public_id: 'sample_laxmi_haar_1' }]
  },
  {
    title: 'Suidhaga Thread Earrings',
    sku: 'SUID-GLD-001',
    description: 'Threader-style suidhaga earrings in gold.',
    purity: '18K',
    weight: 3.1,
    pricePerGram: 6200,
    category: 'Suidhaga',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', public_id: 'sample_suidhaga_1' }]
  },
  {
    title: 'Plain Kada',
    sku: 'KADA-GLD-001',
    description: 'Solid gold kada with smooth finish.',
    purity: '22K',
    weight: 28.0,
    pricePerGram: 6000,
    category: 'Kada',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800', public_id: 'sample_kada_1' }]
  },
  {
    title: 'Classic Bali Hoops',
    sku: 'BALI-GLD-001',
    description: 'Timeless gold hoop earrings (bali).',
    purity: '22K',
    weight: 5.0,
    pricePerGram: 6000,
    category: 'Bali',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1596944924591-4cc082e3e5ad?w=800', public_id: 'sample_bali_1' }]
  },
  {
    title: 'Lakshmi Coins Set',
    sku: 'COIN-GLD-001',
    description: 'Set of gold coins for auspicious occasions.',
    purity: '24K',
    weight: 10.0,
    pricePerGram: 6500,
    category: 'Coins and Bars',
    material: 'Gold',
    occasion: 'Festive',
    images: [{ url: 'https://images.unsplash.com/photo-1567427013953-1e03c5162b81?w=800', public_id: 'sample_coins_1' }]
  },
  {
    title: 'Silver Payal with Bells',
    sku: 'PAYL-SLV-001',
    description: 'Traditional silver anklets with ghungroo bells.',
    purity: '925',
    weight: 38.0,
    pricePerGram: 80,
    category: 'Anklets/Payal',
    material: 'Silver',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1629729375157-3d0d31f98dc1?w=800', public_id: 'sample_payal_1' }]
  },
  {
    title: 'Silver Toe Rings',
    sku: 'TOER-SLV-001',
    description: 'Pair of adjustable silver toe rings.',
    purity: '925',
    weight: 4.2,
    pricePerGram: 80,
    category: 'Toe Rings',
    material: 'Silver',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1621788062433-bba4b2c50f6a?w=800', public_id: 'sample_toe_rings_1' }]
  },
  {
    title: 'Pooja Thali Set',
    sku: 'POOJ-SLV-001',
    description: 'Silver pooja thali set with accessories.',
    purity: '925',
    weight: 120.0,
    pricePerGram: 80,
    category: 'Idols and Pooja Items',
    material: 'Silver',
    occasion: 'Religious',
    images: [{ url: 'https://images.unsplash.com/photo-1622209311503-6d53295d85f3?w=800', public_id: 'sample_pooja_1' }]
  },
  {
    title: 'Silver Fancy Bowl',
    sku: 'FANC-SLV-001',
    description: 'Decorative silver bowl with floral motifs.',
    purity: '925',
    weight: 85.0,
    pricePerGram: 80,
    category: 'Fancy Articles',
    material: 'Silver',
    occasion: 'Gifting',
    images: [{ url: 'https://images.unsplash.com/photo-1604335399100-994c2fe6ec68?w=800', public_id: 'sample_fancy_1' }]
  },
  {
    title: 'Decorative Silver Showpiece',
    sku: 'SHOW-SLV-001',
    description: 'Artistic decorative silver showpiece for home decor.',
    purity: '925',
    weight: 150.0,
    pricePerGram: 80,
    category: 'Decorative Showpieces',
    material: 'Silver',
    occasion: 'Home Decor',
    images: [{ url: 'https://images.unsplash.com/photo-1612198186084-2a63c95cab3f?w=800', public_id: 'sample_showpiece_1' }]
  },
  // ========== WEDDINGS ==========
  {
    title: 'Bridal Temple Necklace Set',
    sku: 'WED-BRD-NECK-001',
    description: 'Grand bridal Laxmi Haar set with matching earrings.',
    purity: '22K',
    weight: 82.5,
    pricePerGram: 6000,
    category: 'Necklaces',
    material: 'Gold',
    occasion: 'Wedding',
    weddingType: 'Bridal Sets',
    images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', public_id: 'wed_bridal_set_1' }]
  },
  {
    title: 'Solitaire Engagement Ring',
    sku: 'WED-ENG-RING-001',
    description: 'Classic diamond solitaire engagement ring.',
    purity: '18K',
    weight: 3.2,
    pricePerGram: 7000,
    category: 'Rings',
    material: 'Diamond',
    occasion: 'Special Events',
    weddingType: 'Engagement Rings',
    images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', public_id: 'wed_engagement_ring_1' }]
  },
  {
    title: 'Matching Couple Bands',
    sku: 'WED-CPL-BAND-001',
    description: 'Pair of matching gold bands for couples.',
    purity: '22K',
    weight: 9.8,
    pricePerGram: 5900,
    category: 'Rings',
    material: 'Gold',
    occasion: 'Wedding',
    weddingType: 'Couple Bands',
    images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', public_id: 'wed_couple_bands_1' }]
  },
  // ========== OCCASIONS ==========
  {
    title: 'Festive Kundan Necklace',
    sku: 'OCC-FES-NECK-001',
    description: 'Kundan work necklace ideal for festive wear.',
    purity: '22K',
    weight: 48.6,
    pricePerGram: 6000,
    category: 'Necklaces',
    material: 'Gold',
    occasion: 'Festive',
    images: [{ url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800', public_id: 'occ_festive_neck_1' }]
  },
  {
    title: 'Daily Wear Stud Earrings',
    sku: 'OCC-DLY-EARR-001',
    description: 'Minimal daily wear studs in 18K gold.',
    purity: '18K',
    weight: 2.6,
    pricePerGram: 6200,
    category: 'Earrings',
    material: 'Gold',
    occasion: 'Daily Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f0e?w=800', public_id: 'occ_daily_earr_1' }]
  },
  {
    title: 'Office Wear Bracelet',
    sku: 'OCC-OFF-BRAC-001',
    description: 'Sleek bracelet designed for office wear.',
    purity: '18K',
    weight: 7.4,
    pricePerGram: 6100,
    category: 'Bracelets',
    material: 'Gold',
    occasion: 'Office Wear',
    images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', public_id: 'occ_office_brac_1' }]
  },
  {
    title: 'Special Events Pendant',
    sku: 'OCC-SPE-PEND-001',
    description: 'Elegant pendant suited for special events.',
    purity: '18K',
    weight: 5.1,
    pricePerGram: 6800,
    category: 'Pendants',
    material: 'Diamond',
    occasion: 'Special Events',
    images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', public_id: 'occ_special_pend_1' }]
  },
  // ========== MATERIALS (EXTRA) ==========
  {
    title: 'Platinum Pendant',
    sku: 'MAT-PLT-PEND-001',
    description: 'Modern platinum pendant with minimalist design.',
    purity: '950',
    weight: 6.2,
    pricePerGram: 3200,
    category: 'Pendants',
    material: 'Platinum',
    occasion: 'Formal',
    images: [{ url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800', public_id: 'mat_platinum_pend_1' }]
  }
];

// Main seed function
async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Add slugs to sample products
    const productsWithSlugs = sampleProducts.map(product => ({
      ...product,
      slug: generateSlug(product.title, product.sku)
    }));

    // Insert sample products with slugs
    const products = await Product.insertMany(productsWithSlugs);
    console.log(`✨ Successfully seeded ${products.length} products!`);

    // Show summary
    console.log('\n📊 Products Summary:');
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} items`);
    });

    console.log('\n💰 Price Range:');
    const prices = products.map(p => p.pricePerGram * p.weight);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    console.log(`   Min: ₹${minPrice.toLocaleString('en-IN')}`);
    console.log(`   Max: ₹${maxPrice.toLocaleString('en-IN')}`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('🌐 You can now view these products at: http://localhost:5173/products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();