"""
Image downloader for Zandeveloper designs.
Downloads 600+ unique images from Pexels (free API).
"""
import os
import sys
import json
import hashlib
import time
import urllib.request
import urllib.error

# Pexels API key (free tier - 200 requests/hour)
PEXELS_API_KEY = os.environ.get('PEXELS_API_KEY', '')

# Categories for 100 designs
DESIGN_CATEGORIES = [
    # Tech & SaaS
    {"name": "SaaS Dashboard", "queries": ["dashboard analytics", "software interface", "data visualization", "chart modern", "business analytics dashboard"], "count": 6},
    {"name": "AI Platform", "queries": ["artificial intelligence", "machine learning", "neural network", "robot technology", "future tech"], "count": 6},
    {"name": "Crypto Exchange", "queries": ["cryptocurrency trading", "bitcoin chart", "blockchain technology", "digital finance", "crypto wallet"], "count": 6},
    {"name": "Cloud Service", "queries": ["cloud computing", "server infrastructure", "data center", "technology cloud", "digital server"], "count": 6},
    {"name": "Dev Tools", "queries": ["programming code", "developer workspace", "coding screen", "software development", "tech workspace"], "count": 6},

    # E-commerce
    {"name": "Fashion Store", "queries": ["fashion photography", "clothing store", "style editorial", "fashion model", "boutique interior"], "count": 6},
    {"name": "Electronics Shop", "queries": ["gadgets technology", "smartphone store", "electronics display", "tech products", "modern gadgets"], "count": 6},
    {"name": "Jewelry Store", "queries": ["luxury jewelry", "gold necklace", "diamond ring", "precious stones", "elegant jewelry"], "count": 6},
    {"name": "Food Delivery", "queries": ["food photography", "restaurant meal", "delicious food", "gourmet dish", "fresh ingredients"], "count": 6},
    {"name": "Home Decor Store", "queries": ["interior design", "modern furniture", "home decoration", "living room design", "minimalist home"], "count": 6},

    # Travel & Hospitality
    {"name": "Luxury Resort", "queries": ["luxury hotel", "resort pool", "tropical paradise", "beach resort", "hotel room luxury"], "count": 6},
    {"name": "Adventure Travel", "queries": ["mountain landscape", "hiking adventure", "outdoor exploration", "nature wilderness", "adventure sports"], "count": 6},
    {"name": "City Guide", "queries": ["city skyline", "urban architecture", "cityscape night", "metropolitan city", "city streets"], "count": 6},
    {"name": "Cruise Line", "queries": ["cruise ship", "ocean voyage", "luxury cruise", "sea travel", "yacht luxury"], "count": 6},
    {"name": "Safari Lodge", "queries": ["african safari", "wildlife photography", "safari lodge", "nature wildlife", "savanna landscape"], "count": 6},

    # Food & Restaurant
    {"name": "Fine Dining", "queries": ["fine dining restaurant", "elegant restaurant", "gourmet plating", "restaurant interior", "chef cooking"], "count": 6},
    {"name": "Coffee Shop", "queries": ["coffee shop interior", "latte art", "cafe atmosphere", "coffee beans", "cozy cafe"], "count": 6},
    {"name": "Bakery", "queries": ["bakery display", "fresh bread", "pastries cake", "bakery interior", "artisan bread"], "count": 6},
    {"name": "Sushi Restaurant", "queries": ["sushi platter", "japanese food", "sushi restaurant", "fresh sashimi", "japanese cuisine"], "count": 6},
    {"name": "Pizzeria", "queries": ["pizza restaurant", "fresh pizza", "italian food", "wood fired pizza", "pizzeria interior"], "count": 6},

    # Real Estate
    {"name": "Luxury Villa", "queries": ["luxury villa", "modern house", "architectural home", "mansion exterior", "dream house"], "count": 6},
    {"name": "Penthouse", "queries": ["penthouse apartment", "city view apartment", "luxury interior", "modern living room", "skyline view"], "count": 6},
    {"name": "Beachfront Property", "queries": ["beach house", "oceanfront home", "coastal property", "beach view", "seaside villa"], "count": 6},
    {"name": "Mountain Cabin", "queries": ["mountain cabin", "rustic lodge", "cabin interior", "mountain retreat", "cozy cabin"], "count": 6},
    {"name": "Urban Loft", "queries": ["urban loft", "industrial apartment", "city loft", "modern loft interior", "converted warehouse"], "count": 6},

    # Portfolio & Creative
    {"name": "Photographer Portfolio", "queries": ["photography portfolio", "camera equipment", "photo studio", "portrait photography", "photo exhibition"], "count": 6},
    {"name": "Designer Portfolio", "queries": ["design workspace", "creative studio", "graphic design", "design tools", "creative process"], "count": 6},
    {"name": "Architect Portfolio", "queries": ["architecture design", "building model", "architectural drawing", "modern building", "blueprint design"], "count": 6},
    {"name": "Music Artist", "queries": ["music studio", "recording studio", "music performance", "concert stage", "vinyl records"], "count": 6},
    {"name": "Film Production", "queries": ["film production", "movie camera", "cinema studio", "film set", "video production"], "count": 6},

    # Education
    {"name": "Online Academy", "queries": ["online learning", "education platform", "virtual classroom", "study space", "knowledge books"], "count": 6},
    {"name": "Language School", "queries": ["language learning", "multilingual", "global education", "cultural exchange", "world languages"], "count": 6},
    {"name": "Coding Bootcamp", "queries": ["coding bootcamp", "programming class", "tech education", "learn coding", "developer training"], "count": 6},
    {"name": "Music Academy", "queries": ["music education", "piano lessons", "music school", "instrument learning", "musical training"], "count": 6},
    {"name": "Art School", "queries": ["art education", "painting class", "art studio", "creative learning", "artistic training"], "count": 6},

    # Health & Fitness
    {"name": "Gym & Fitness", "queries": ["gym interior", "fitness equipment", "workout space", "training facility", "exercise equipment"], "count": 6},
    {"name": "Yoga Studio", "queries": ["yoga studio", "meditation space", "wellness center", "yoga practice", "peaceful studio"], "count": 6},
    {"name": "Medical Clinic", "queries": ["modern clinic", "medical office", "healthcare facility", "hospital interior", "doctor office"], "count": 6},
    {"name": "Spa & Wellness", "queries": ["spa treatment", "wellness massage", "relaxation spa", "beauty treatment", "spa interior"], "count": 6},
    {"name": "Nutrition App", "queries": ["healthy food", "nutrition plan", "diet meal", "fitness nutrition", "healthy eating"], "count": 6},

    # Finance
    {"name": "Banking App", "queries": ["banking app", "financial dashboard", "mobile banking", "digital payment", "bank interface"], "count": 6},
    {"name": "Investment Platform", "queries": ["stock market", "investment portfolio", "trading platform", "financial charts", "wealth management"], "count": 6},
    {"name": "Insurance Portal", "queries": ["insurance policy", "coverage plan", "protection insurance", "safety net", "insurance agent"], "count": 6},
    {"name": "Accounting Software", "queries": ["accounting software", "bookkeeping", "financial records", "invoice management", "tax preparation"], "count": 6},
    {"name": "Crowdfunding", "queries": ["crowdfunding campaign", "startup funding", "invest in ideas", "support projects", "fund raising"], "count": 6},

    # Entertainment
    {"name": "Streaming Service", "queries": ["movie streaming", "tv shows", "entertainment platform", "video on demand", "cinema experience"], "count": 6},
    {"name": "Gaming Platform", "queries": ["gaming setup", "esports arena", "gaming pc", "video games", "gaming community"], "count": 6},
    {"name": "Podcast Platform", "queries": ["podcast studio", "microphone recording", "audio content", "podcast listening", "radio show"], "count": 6},
    {"name": "Event Management", "queries": ["event planning", "concert venue", "conference hall", "festival event", "celebration venue"], "count": 6},
    {"name": "Social Network", "queries": ["social media", "community platform", "online connection", "digital social", "networking event"], "count": 6},

    # Automotive
    {"name": "Car Dealership", "queries": ["luxury car", "automobile showroom", "sports car", "car dealership", "vehicle display"], "count": 6},
    {"name": "EV Platform", "queries": ["electric vehicle", "tesla charging", "green transportation", "ev charging station", "sustainable car"], "count": 6},
    {"name": "Auto Service", "queries": ["auto repair shop", "car maintenance", "mechanic workshop", "garage interior", "car service"], "count": 6},
    {"name": "Motorcycle Shop", "queries": ["motorcycle showroom", "bike display", "motorcycle gear", "riding equipment", "motorcycle shop"], "count": 6},
    {"name": "Car Rental", "queries": ["car rental service", "vehicle fleet", "rent a car", "travel car", "rental agency"], "count": 6},

    # Fashion & Beauty
    {"name": "Cosmetics Brand", "queries": ["cosmetics display", "beauty products", "makeup collection", "skincare products", "beauty brand"], "count": 6},
    {"name": "Fashion Label", "queries": ["fashion collection", "runway show", "fashion editorial", "clothing brand", "fashion design"], "count": 6},
    {"name": "Sneaker Store", "queries": ["sneaker collection", "athletic shoes", "shoe display", "sneaker culture", "footwear store"], "count": 6},
    {"name": "Perfume Brand", "queries": ["perfume bottle", "fragrance display", "luxury perfume", "scent collection", "cologne bottle"], "count": 6},
    {"name": "Watch Brand", "queries": ["luxury watch", "timepiece collection", "watch display", "premium watches", "watch brand"], "count": 6},

    # Sports
    {"name": "Sports Club", "queries": ["sports club", "stadium interior", "athletic facility", "sports equipment", "team sports"], "count": 6},
    {"name": "Surf Shop", "queries": ["surfboard collection", "surfing culture", "ocean surf", "beach sports", "surf equipment"], "count": 6},
    {"name": "Ski Resort", "queries": ["ski resort", "winter sports", "snow skiing", "mountain ski", "alpine lodge"], "count": 6},
    {"name": "Golf Club", "queries": ["golf course", "golf club", "golf equipment", "green fairway", "golf resort"], "count": 6},
    {"name": "Tennis Academy", "queries": ["tennis court", "tennis equipment", "tennis training", "racket sport", "tennis club"], "count": 6},

    # Non-Profit & Government
    {"name": "NGO Platform", "queries": ["nonprofit organization", "charity work", "community service", "volunteer work", "social impact"], "count": 6},
    {"name": "Government Portal", "queries": ["government building", "public service", "civic center", "city hall", "public administration"], "count": 6},
    {"name": "Environmental Org", "queries": ["environmental protection", "green earth", "sustainability", "eco friendly", "nature conservation"], "count": 6},
    {"name": "Education Foundation", "queries": ["education foundation", "school building", "learning center", "educational institution", "academic campus"], "count": 6},
    {"name": "Health Foundation", "queries": ["health foundation", "medical research", "healthcare charity", "medical aid", "health organization"], "count": 6},

    # Miscellaneous
    {"name": "Coworking Space", "queries": ["coworking space", "shared office", "startup hub", "creative office", "flexible workspace"], "count": 6},
    {"name": "Pet Store", "queries": ["pet shop", "animal store", "pet supplies", "dog accessories", "cat products"], "count": 6},
    {"name": "Flower Shop", "queries": ["flower shop", "floral arrangement", "fresh flowers", "bouquet delivery", "florist store"], "count": 6},
    {"name": "Bookstore", "queries": ["bookstore interior", "book library", "reading space", "book collection", "literary shop"], "count": 6},
    {"name": "Winery", "queries": ["wine cellar", "vineyard", "wine tasting", "winery estate", "wine bottles"], "count": 6},
]

# Image storage path
IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'media', 'designs', 'gallery')
os.makedirs(IMAGE_DIR, exist_ok=True)

# Track downloaded images
DOWNLOADED_HASHES = set()
DOWNLOADED_FILES = []

def get_file_hash(data):
    return hashlib.md5(data).hexdigest()

def download_image(url, filepath):
    """Download image from URL and save to filepath."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
            file_hash = get_file_hash(data)
            if file_hash in DOWNLOADED_HASHES:
                print(f"  Skipping duplicate: {url[:60]}...")
                return False
            DOWNLOADED_HASHES.add(file_hash)
            with open(filepath, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f"  Error downloading {url[:60]}...: {e}")
        return False

def download_from_pexels(query, count, design_idx, img_idx_start):
    """Download images from Pexels API."""
    if not PEXELS_API_KEY:
        print("  No PEXELS_API_KEY set, using fallback URLs")
        return []
    
    downloaded = []
    url = f"https://api.pexels.com/v1/search?query={query.replace(' ', '+')}&per_page={count}&page=1"
    req = urllib.request.Request(url, headers={'Authorization': PEXELS_API_KEY})
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read())
            photos = data.get('photos', [])[:count]
            
            for i, photo in enumerate(photos):
                img_url = photo.get('src', {}).get('large', '')
                if not img_url:
                    continue
                
                filename = f"design-{design_idx:03d}-{img_idx_start + i:02d}.jpg"
                filepath = os.path.join(IMAGE_DIR, filename)
                
                if download_image(img_url, filepath):
                    downloaded.append(filename)
                    print(f"  Downloaded: {filename}")
                time.sleep(0.3)  # Rate limiting
    except Exception as e:
        print(f"  Pexels API error: {e}")
    
    return downloaded

def download_fallback_images(design_idx, count=6):
    """Download from Unsplash source (no API key needed)."""
    downloaded = []
    # Use specific Unsplash photo IDs for unique images
    unsplash_ids = [
        # Tech & SaaS
        "1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1551434678-e076c223a692",
        "1504639725590-34d0984388bd", "1519389950473-47ba0277781c", "1517694712202-14dd9538aa97",
        # Fashion
        "1441986300917-64674bd600d8", "1445205170230-053b83016050", "1490481651871-ab68de25d43d",
        "1558618666-fcd25c85f82e", "1469334031218-e3dafb073655", "1542291026-7eec264c27ff",
        # Travel
        "1506929562872-bb421503ef21", "1476514525535-07fb3b4ae5f1", "1507525428034-b723cf961d3e",
        "1519046904884-53103b34b206", "1502602898657-3e91760cbb34", "1488646953014-85cb44e25828",
        # Food
        "1504674900247-0877df9cc836", "1509042239860-f550ce710b93", "1517433367423-c7e5b0f35086",
        "1540189549336-e6e99c3679fe", "1476224203421-9ac39bcb3327", "1482049016688-2d3e1b311543",
        # Real Estate
        "1600596542815-ffad4c1539a9", "1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c",
        "1600566753190-17f0baa2a6c3", "1600585154526-990dced4db0d", "1600573472591-ee6981cf81d6",
        # Portfolio
        "1452587925148-ce544e77e70d", "1558618666-fcd25c85f82e", "1507003211169-0a1dd7228f2d",
        "1494790108377-be9c29b29330", "1517841905240-472988babdf9", "1539571696357-5a69c17a67c6",
        # Education
        "1503676260728-1c00da094a0b", "1522202176988-66273c2fd55f", "1488190211105-8b0e65b80b4e",
        "1456513080510-7bf3a84b82f8", "1434030216411-0b793f4b4173", "1501504905252-473c47e087f8",
        # Health
        "1571019613454-1cb2f99b2d8b", "1544367567-0f2fcb009e0b", "1519494026892-80bbd2d6fd0d",
        "1540497077202-7c8a3999166f", "1576091160550-2173dba999ef", "1512621776951-a57141f2eefd",
        # Finance
        "1556742049-0cfed4f6a45d", "1611974789855-9e2a5f30421f", "1554224155-6726b3ff858f",
        "1460925895917-afdab827c52f", "1551288049-bebda4e38f71", "1618044733300-9472054094ed",
        # Entertainment
        "1511671782779-c97d3d27a1d4", "1542751371-adc38448a05e", "1478737270239-2f02b77fc618",
        "1514525253161-7a46d19cd819", "1501281668745-f7f57925c3b4", "1493225457124-a3eb161ffa5f",
        # Automotive
        "1494976388531-d1058494cdd8", "1558618666-fcd25c85f82e", "1492144534655-ae79c964c9d7",
        "1503376780353-7e6692767b70", "1549317661-bd32c8ce0db2", "1552519507-da3b142c6e3d",
        # Beauty
        "1596462502278-27bfdc403348", "1571781926291-c477ebfd024b", "1522335789203-aabd1fc54bc9",
        "1515377905703-c4788e51af15", "1583241800898-3e3d8a9e4b1e", "1522338242992-e1a54571a7d8",
        # Sports
        "1461896836934-bd45ba8fcf9b", "1508098682722-e99c43a406b2", "1517649763962-0c623066013b",
        "1535139262971-c51845709a48", "1551958219-acbc608c6377", "1541252260730-0412e8e3e518",
        # Music
        "1511379938547-c1f69419868d", "1598488035139-bdbb2231ce04", "1514320291840-2e0a9bf2a9ae",
        "1511671782779-c97d3d27a1d4", "1493225457124-a3eb161ffa5f", "1470225620780-dba8ba36b745",
        # Nature & Organic
        "1441974231531-c6227db76b6e", "1470071459604-3b5ec3a7fe05", "1446329813274-7c9036bd9a1f",
        "1501854140801-50d01698950b", "1472214103451-9374bd1c798e", "1500534623283-312aade485b7",
        # Abstract & Creative
        "1550684376-efcbd6e3f031", "1557682250-33bd709cbe85", "1558591710-4b4a1ae0f04d",
        "1557672172-298e090bd0f1", "1550859492-d5da9d8e45f3", "1558618666-fcd25c85f82e",
        # Minimal
        "1494438639946-1ebd1d20bf85", "1505761671935-60b3a7427bad", "1507003211169-0a1dd7228f2d",
        "1516541196182-6bdb0516f239", "1519681393784-d120267933ba", "1507525428034-b723cf961d3e",
        # Luxury
        "1600607687939-ce8a6c25118c", "1600566753190-17f0baa2a6c3", "1600585154340-be6161a56a0c",
        "1600596542815-ffad4c1539a9", "1600573472591-ee6981cf81d6", "1600585154526-990dced4db0d",
        # Corporate
        "1497366216548-37526070297c", "1497366811353-6870744d04b2", "1497215728101-856f4c4a1fbb",
        "1486406146926-c627a92ad1ab", "1497366754035-f200968a6e72", "1497215807028-c38b3fee32d2",
        # Agriculture
        "1500382017468-9049fed747ef", "1464226184884-fa280b87c399", "1523348837708-15d4a09cfac2",
        "1574943320219-553eb213f72d", "1530836369250-ef72a3f5cda4", "1416879595882-3373a0480b5b",
        # Space
        "1446776811953-b23d57bd21aa", "1451187580459-43490279c0fa", "1462331940025-496dfbfc7564",
        "1614730321146-b6fa6a42b9e3", "1454789548928-9efd52dc4031", "1516849841032-87cbec4d86f7",
        # Gaming
        "1542751371-adc38448a05e", "1538481199705-c710c4e965fc", "1552820728-8b83bb6b2b28",
        "1511512578047-dfb367046420", "1542204165-65bf26472b9b", "1550745165-9bc0b252726f",
        #underwater & ocean
        "1544551763-46a013bb70d5", "1507525428034-b723cf961d3e", "1519046904884-53103b34b206",
        "1505118380757-91f5f5632de0", "1544551763-46a013bb70d5", "1505228896786-959d6d497f1a",
        # Desert
        "1509316975850-ff9c5deb0cd9", "1473580044384-7ba9967e16a0", "1509316785289-025f5b846b35",
        "1542401886-65d6c61db217", "1507400458856-8b5bf0a55b84", "1473448912268-2022ce9509d8",
        # Snow
        "1491002052546-bf38f186af56", "1477601263568-180e2c6d046e", "1517299321607-2fef1dd3ea13",
        "1483728642387-6c3bdd6c93e5", "1520986606214-8b456906c813", "1491002052546-bf38f186af56",
    ]
    
    for i in range(count):
        idx = ((design_idx - 1) * 6 + i) % len(unsplash_ids)
        photo_id = unsplash_ids[idx]
        url = f"https://images.unsplash.com/photo-{photo_id}?w=1200&q=80&auto=format"
        
        filename = f"design-{design_idx:03d}-{i+1:02d}.jpg"
        filepath = os.path.join(IMAGE_DIR, filename)
        
        if os.path.exists(filepath):
            downloaded.append(filename)
            continue
            
        if download_image(url, filepath):
            downloaded.append(filename)
            print(f"  Downloaded: {filename}")
        time.sleep(0.5)
    
    return downloaded

def main():
    print("=" * 60)
    print("ZANDEVELOPER IMAGE DOWNLOADER")
    print("=" * 60)
    print(f"Target: {len(DESIGN_CATEGORIES) * 6} images for {len(DESIGN_CATEGORIES)} designs")
    print(f"Storage: {IMAGE_DIR}")
    print()
    
    all_images = {}
    
    for idx, design in enumerate(DESIGN_CATEGORIES, 1):
        print(f"[{idx}/{len(DESIGN_CATEGORIES)}] {design['name']}")
        
        if PEXELS_API_KEY:
            # Use Pexels API
            images = []
            for query in design['queries'][:2]:
                result = download_from_pexels(query, 3, idx, len(images) + 1)
                images.extend(result)
                if len(images) >= 6:
                    break
            if len(images) < 6:
                images.extend(download_fallback_images(idx, 6 - len(images)))
        else:
            # Use Unsplash fallback
            images = download_fallback_images(idx, 6)
        
        all_images[design['name']] = images
        print(f"  Total: {len(images)} images")
        print()
    
    # Save manifest
    manifest_path = os.path.join(IMAGE_DIR, 'manifest.json')
    with open(manifest_path, 'w') as f:
        json.dump(all_images, f, indent=2)
    
    total = sum(len(v) for v in all_images.values())
    print("=" * 60)
    print(f"COMPLETE: {total} images downloaded for {len(all_images)} designs")
    print(f"Manifest saved to: {manifest_path}")
    print("=" * 60)

if __name__ == '__main__':
    main()
