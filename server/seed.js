
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Feature = require("./models/Feature");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { imageUploadUtil } = require("./helpers/cloudinary");

const categories = ["men", "women", "kids", "accessories", "footwear"];
const brands = ["nike", "adidas", "puma", "levi", "zara", "h&m"];

// Image dictionary to ensure related images
const imageMap = {
    men: {
        nike: [
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop", // Nike sneakers (generic sport)
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop", // Red Nike shoe
            "https://images.unsplash.com/photo-1515555230216-82228b88ea98?q=80&w=1926&auto=format&fit=crop", // Male model
            "https://images.unsplash.com/photo-1605296867304-6fbb535cb083?q=80&w=1887&auto=format&fit=crop"  // Men's fashion
        ],
        adidas: [
            "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?q=80&w=2031&auto=format&fit=crop", // Adidas shoe
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop", // Adidas shoe
            "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1932&auto=format&fit=crop", // Man in hoodie
            "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?q=80&w=1903&auto=format&fit=crop"  // Travelers/Active men
        ],
        puma: [
            "https://images.unsplash.com/photo-16use this image 08231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop", // Puma sneakers (placeholder, reusing good shoe)
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop", // Green Puma/Nike style
            "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=2070&auto=format&fit=crop", // Men's gym
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1887&auto=format&fit=crop"  // Men's shirt
        ],
        levi: [
            "https://images.unsplash.com/photo-1604176354204-9268737828c4?q=80&w=2080&auto=format&fit=crop", // Jeans details
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1887&auto=format&fit=crop", // Denim jacket
            "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1866&auto=format&fit=crop", // Jeans texture
            "https://images.unsplash.com/photo-1563205008-07a827dfec92?q=80&w=1887&auto=format&fit=crop"  // Man in denim
        ],
        zara: [
            "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop", // Men fashion
            "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop", // Suits/Minimal
            "https://images.unsplash.com/photo-1507680436348-4e6471973d09?q=80&w=1887&auto=format&fit=crop", // Formal
            "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=2080&auto=format&fit=crop"  // Smart casual
        ],
        "h&m": [
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop", // T-shirt
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1827&auto=format&fit=crop", // Casual
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop", // Sweater
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"  // White Tee
        ]
    },
    women: {
        nike: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop", // Woman sportswear
            "https://images.unsplash.com/photo-1518933256073-a80d5bfa4a4a?q=80&w=1887&auto=format&fit=crop", // Active wear
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop", // Sneakers
            "https://images.unsplash.com/photo-1596702674945-8c764e2ce2e2?q=80&w=2070&auto=format&fit=crop"  // Running
        ],
        adidas: [
            "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1887&auto=format&fit=crop", // Woman fashion
            "https://images.unsplash.com/photo-1549448831-29e1eb1c463b?q=80&w=1887&auto=format&fit=crop", // Woman sneakers
            "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=2079&auto=format&fit=crop", // Shoes
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"  // Fashion
        ],
        puma: [
            "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop", // Woman casual
            "https://images.unsplash.com/photo-1604066927901-4436579c2999?q=80&w=2070&auto=format&fit=crop", // Sporty
            "https://images.unsplash.com/photo-1514989940723-e882bc57cbe8?q=80&w=1888&auto=format&fit=crop", // Casual
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop"  // Fitness
        ],
        levi: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1887&auto=format&fit=crop", // Denim
            "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1973&auto=format&fit=crop", // Shorts
            "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=2030&auto=format&fit=crop", // Jeans
            "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=1887&auto=format&fit=crop"  // Jeans rear
        ],
        zara: [
            "https://images.unsplash.com/photo-1545959734-75467406c5aa?q=80&w=1884&auto=format&fit=crop", // Dress
            "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=2069&auto=format&fit=crop", // Fashion Model
            "https://images.unsplash.com/photo-1550614000-4b9519e02a48?q=80&w=1887&auto=format&fit=crop", // Elegant
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887&auto=format&fit=crop"  // Stylish
        ],
        "h&m": [
            "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1964&auto=format&fit=crop", // Shopping bag style
            "https://images.unsplash.com/photo-1509631179647-b8db23f50228?q=80&w=2070&auto=format&fit=crop", // Dress
            "https://images.unsplash.com/photo-1510344781428-ba1e6e021a81?q=80&w=1887&auto=format&fit=crop", // Outdoor
            "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=2022&auto=format&fit=crop"  // Clothes rack
        ]
    },
    kids: {
        nike: [
            "https://images.unsplash.com/photo-1519238263496-63f826257573?q=80&w=2071&auto=format&fit=crop", // Kid playing
            "https://images.unsplash.com/photo-1520113824147-3dc6129c513a?q=80&w=1887&auto=format&fit=crop", // Kid sitting
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070&auto=format&fit=crop", // Boy
            "https://images.unsplash.com/photo-1475823678248-624fc6f85785?q=80&w=2070&auto=format&fit=crop"  // Kids group
        ],
        adidas: [
            "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2069&auto=format&fit=crop", // Girl
            "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=2070&auto=format&fit=crop", // Boy
            "https://images.unsplash.com/photo-1503919545889-aef6d293c94c?q=80&w=1887&auto=format&fit=crop", // Child fashion
            "https://images.unsplash.com/photo-1502086208076-79133a878bd6?q=80&w=2070&auto=format&fit=crop"  // Kid
        ],
        puma: [
            "https://images.unsplash.com/photo-1543357597-2a672729c158?q=80&w=1887&auto=format&fit=crop", // Infant
            "https://images.unsplash.com/photo-1491013516836-7dbc64bf9656?q=80&w=1887&auto=format&fit=crop", // Boy reading (shirt)
            "https://images.unsplash.com/photo-1512903511211-3e0e159958dc?q=80&w=1974&auto=format&fit=crop", // Girl
            "https://images.unsplash.com/photo-1534952671040-621aa16e1e77?q=80&w=1964&auto=format&fit=crop"  // Child
        ],
        // Fill others with generic kids
        "default": [
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1888&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1471286174890-9c808743015a?q=80&w=2069&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1513364999909-0d2d34674c15?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    accessories: {
        // Brands don't matter as much here, reuse generic accessories for all brands or map key brands if needed
        "default": [
            "https://images.unsplash.com/photo-1576053139778-7e32f5f0c841?q=80&w=2080&auto=format&fit=crop", // Watch
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2135&auto=format&fit=crop", // Bag
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop", // Sunglasses
            "https://images.unsplash.com/photo-1614165936126-2ed18e471b10?q=80&w=2074&auto=format&fit=crop", // Watch closeup
            "https://images.unsplash.com/photo-1509319117185-84f11434a703?q=80&w=1887&auto=format&fit=crop" // Hat
        ]
    },
    footwear: {
        nike: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop", // Red Nike
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop", // Green Nike
            "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop", // Blue Nike
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"  // Shoes
        ],
        adidas: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop", // Adidas
            "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?q=80&w=2031&auto=format&fit=crop", // Adidas
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&auto=format&fit=crop", // Shoes
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996&auto=format&fit=crop" // Vans style but ok
        ],
        puma: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop", // Adidas
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&auto=format&fit=crop", // Shoes
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=2030&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560769629-975e12af9897?q=80&w=2072&auto=format&fit=crop"
        ],
        // Use default shoes for others
        "default": [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=2030&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560769629-975e12af9897?q=80&w=2072&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996&auto=format&fit=crop"
        ]
    }
};

const adjectives = [
    "Classic", "Modern", "Sleek", "Durable", "Comfortable",
    "Premium", "Exclusive", "Stylish", "Elegant", "Casual",
    "Urban", "Vintage", "Sporty", "Chic", "Trendy"
];

const categoryNouns = {
    men: ["T-Shirt", "Jacket", "Jeans", "Hoodie", "Sweater", "Chinos", "Polo", "Blazer", "Shorts", "Vest"],
    women: ["Dress", "Blouse", "Skirt", "Jeans", "Cardigan", "Top", "Leggings", "Jacket", "Coat", "Tunic"],
    kids: ["Onesie", "T-Shirt", "Shorts", "Pajamas", "Hoodie", "Jacket", "Leggings", "Dress", "Romper", "Sweatshirt"],
    accessories: ["Watch", "Bag", "Wallet", "Belt", "Sunglasses", "Hat", "Cap", "Scarf", "Backpack", "Necklace"],
    footwear: ["Sneakers", "Boots", "Sandals", "Running Shoes", "Loafers", "Heels", "Slippers", "Trainers", "Formal Shoes", "Flats"]
};

const bannerImages = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-41ae316e5329?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateUniqueProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        await Product.deleteMany({});
        await Feature.deleteMany({});
        await User.deleteMany({});
        console.log("Cleared existing data.");

        // Create Admin User
        const hashPassword = await bcrypt.hash("admin123", 12);
        const adminUser = new User({
            userName: "admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin",
        });
        await adminUser.save();
        console.log("Created Admin User: admin@gmail.com / admin123");

        // Helper to upload images with caching
        const uploadedImages = {};
        const getCloudinaryUrl = async (url) => {
            if (uploadedImages[url]) return uploadedImages[url];
            try {
                console.log(`Uploading image to Cloudinary: ${url}`);
                const result = await imageUploadUtil(url);
                if (result && result.secure_url) {
                    uploadedImages[url] = result.secure_url;
                    return result.secure_url;
                } else {
                    console.warn(`Upload failed for ${url}, using original.`);
                    return url;
                }
            } catch (error) {
                console.error(`Error uploading ${url}:`, error.message);
                return url;
            }
        };

        const products = [];
        let globalCounter = 1;

        for (const category of categories) {
            for (const brand of brands) {
                // 4 products per brand-category combo
                for (let i = 0; i < 4; i++) {
                    const adjective = getRandomItem(adjectives);
                    const noun = getRandomItem(categoryNouns[category]);

                    const uniqueTitle = `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${adjective} ${noun} ${globalCounter}`;

                    // Logic to fetch related image
                    let imageList = [];
                    // Check if category exists
                    if (imageMap[category]) {
                        // Check if specific brand exists in category
                        if (imageMap[category][brand]) {
                            imageList = imageMap[category][brand];
                        } else if (imageMap[category]["default"]) {
                            imageList = imageMap[category]["default"];
                        } else {
                            // Safety backup:
                            imageList = Object.values(imageMap[category])[0] || [];
                        }
                    }

                    // If still empty (should not happen with my map), fallback to generic
                    if (imageList.length === 0) {
                        imageList = bannerImages;
                    }

                    const originalImage = imageList[i % imageList.length];
                    const cloudinaryImage = await getCloudinaryUrl(originalImage);

                    const price = Math.floor(Math.random() * 8000) + 500;
                    const hasSale = Math.random() > 0.4;
                    const salePrice = hasSale ? Math.floor(price * 0.8) : null;

                    products.push({
                        image: cloudinaryImage,
                        title: uniqueTitle,
                        description: `Experience the ${adjective.toLowerCase()} quality of this ${brand} ${noun.toLowerCase()}. Perfect for your ${category} collection.`,
                        category,
                        brand,
                        price,
                        salePrice,
                        totalStock: Math.floor(Math.random() * 100) + 10,
                        averageReview: 0,
                    });

                    globalCounter++;
                }
            }
        }

        await Product.insertMany(products);
        console.log(`Seeded ${products.length} unique products.`);

        const path = require("path");

        // ... (existing imports)

        // ... (inside generateUniqueProducts)

        const features = [];
        const localAssets = [
            { path: "../client/src/assets/banner-1.webp", type: "slider" },
            { path: "../client/src/assets/banner-2.webp", type: "slider" },
            { path: "../client/src/assets/banner-3.webp", type: "slider" },
            { path: "../client/src/assets/account.jpg", type: "account" },
            { path: "../client/src/assets/login-banner.jpg", type: "login" },
        ];

        for (const asset of localAssets) {
            const fullPath = path.join(__dirname, asset.path);
            try {
                console.log(`Uploading ${asset.path} to Cloudinary...`);
                // Use built-in cloudinary upload directly for local files or utilize the helper if it supports path strings (it does)
                const result = await imageUploadUtil(fullPath);
                if (result && result.secure_url) {
                    features.push({ image: result.secure_url, type: asset.type });
                } else {
                    console.error(`Failed to upload ${asset.path}`);
                }
            } catch (error) {
                console.error(`Error uploading ${asset.path}:`, error.message);
            }
        }
        await Feature.insertMany(features);
        console.log(`Seeded ${features.length} feature images.`);

        console.log("Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

generateUniqueProducts();
