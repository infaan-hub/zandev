EXTRA_DESIGNS = [
    # ==================== E-COMMERCE (30 designs) ====================
    {
        "name": "Sneaker Store",
        "category": "E-Commerce",
        "framework": "React",
        "price": "$49",
        "score": 93,
        "description": "Modern sneaker e-commerce with product grid, filters, and shopping cart.",
        "preview": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function SneakerStore() {
  const [cart, setCart] = useState([]);
  const products = [
    { id: 1, name: 'Air Max 90', price: 129, color: 'White/Black' },
    { id: 2, name: 'Yeezy Boost 350', price: 230, color: 'Cream' },
    { id: 3, name: 'Jordan 1 Retro', price: 180, color: 'Bred' },
    { id: 4, name: 'New Balance 550', price: 110, color: 'White/Green' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">SoleVault</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">New Arrivals</a>
          <a href="#" className="hover:text-white">Collections</a>
          <a href="#" className="hover:text-white">Sale</a>
        </div>
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg">Cart ({cart.length})</button>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">New Arrivals</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-xs border border-white/10 rounded-lg text-gray-400">Filter</button>
            <button className="px-4 py-2 text-xs border border-white/10 rounded-lg text-gray-400">Sort</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/15 transition-colors">
              <div className="aspect-square bg-gradient-to-br from-white/[0.04] to-transparent" />
              <div className="p-4">
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.color}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold">${p.price}</span>
                  <button onClick={() => setCart([...cart, p])} className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Fashion Boutique",
        "category": "E-Commerce",
        "framework": "React",
        "price": "$59",
        "score": 90,
        "description": "High-end fashion store with lookbook, size guide, and wishlist functionality.",
        "preview": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
        "code": """export default function FashionBoutique() {
  const items = [
    { name: 'Silk Dress', price: 289, img: 'from-pink-500/10 to-purple-500/10' },
    { name: 'Cashmere Sweater', price: 195, img: 'from-amber-500/10 to-orange-500/10' },
    { name: 'Leather Jacket', price: 450, img: 'from-gray-500/10 to-slate-500/10' },
    { name: 'Denim Jeans', price: 145, img: 'from-blue-500/10 to-indigo-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-light tracking-widest">MAISON</div>
        <div className="flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Women</a>
          <a href="#" className="hover:text-white">Men</a>
          <a href="#" className="hover:text-white">Accessories</a>
          <a href="#" className="hover:text-white">Lookbook</a>
        </div>
        <div className="flex gap-4 text-sm">
          <button className="text-gray-400 hover:text-white">♡</button>
          <button className="text-gray-400 hover:text-white">Bag (0)</button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-light tracking-tight mb-4">Spring Collection</h1>
        <p className="text-gray-400 mb-12 max-w-md">Curated pieces for the modern wardrobe. Timeless elegance meets contemporary design.</p>
        <div className="grid grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.name} className="group cursor-pointer">
              <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${item.img} mb-4`} />
              <h3 className="font-medium">{item.name}</h3>
              <div className="text-sm text-gray-500 mt-1">${item.price}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Organic Market",
        "category": "E-Commerce",
        "framework": "React",
        "price": "$39",
        "score": 87,
        "description": "Organic food marketplace with product categories, farm profiles, and subscription boxes.",
        "preview": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop",
        "code": """export default function OrganicMarket() {
  const categories = [
    { name: 'Fresh Produce', count: 48, icon: '🥬' },
    { name: 'Dairy & Eggs', count: 24, icon: '🥚' },
    { name: 'Bakery', count: 32, icon: '🍞' },
    { name: 'Beverages', count: 19, icon: '🥤' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold text-green-400">FreshRoots</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Shop</a>
          <a href="#" className="hover:text-white">Farms</a>
          <a href="#" className="hover:text-white">Subscribe</a>
        </div>
        <button className="px-5 py-2 bg-green-500 text-black text-sm font-semibold rounded-lg">Cart</button>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Farm-fresh <span className="text-green-400">organic</span></h1>
        <p className="text-gray-400 mb-12 max-w-md">Direct from local farms to your table. 100% organic, sustainably sourced.</p>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors text-center">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{c.count} items</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Tech Gadget Store",
        "category": "E-Commerce",
        "framework": "React",
        "price": "$49",
        "score": 89,
        "description": "Technology gadget store with product comparisons, reviews, and deals section.",
        "preview": "https://images.unsplash.com/photo-1468499282159-67a6fff7e641?w=800&h=500&fit=crop",
        "code": """export default function TechGadgetStore() {
  const products = [
    { name: 'Wireless Earbuds', price: 79, rating: 4.8, reviews: 234 },
    { name: 'Smart Watch Pro', price: 299, rating: 4.6, reviews: 189 },
    { name: 'Portable Charger', price: 45, rating: 4.9, reviews: 567 },
    { name: 'Bluetooth Speaker', price: 129, rating: 4.7, reviews: 312 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">TechNova</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Deals</a>
          <a href="#" className="hover:text-white">New Arrivals</a>
          <a href="#" className="hover:text-white">Best Sellers</a>
        </div>
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg">Shop Now</button>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 mb-12">
          <h1 className="text-4xl font-bold mb-3">Tech Deals</h1>
          <p className="text-gray-400 mb-6">Up to 40% off on selected gadgets</p>
          <button className="px-6 py-2 bg-white text-black text-sm font-semibold rounded-lg">Shop Deals</button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.name} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="aspect-square bg-white/[0.03]" />
              <div className="p-4">
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-yellow-400">★ {p.rating}</span>
                  <span className="text-xs text-gray-500">({p.reviews})</span>
                </div>
                <div className="font-bold mt-2">${p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Pet Supply Shop",
        "category": "E-Commerce",
        "framework": "React",
        "price": "$29",
        "score": 85,
        "description": "Pet supply store with product categories, pet profiles, and auto-ship subscriptions.",
        "preview": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop",
        "code": """export default function PetSupplyShop() {
  const products = [
    { name: 'Premium Dog Food', price: 49, pet: 'Dog', rating: 4.9 },
    { name: 'Cat Scratching Post', price: 35, pet: 'Cat', rating: 4.7 },
    { name: 'Pet Carrier Bag', price: 65, pet: 'Both', rating: 4.8 },
    { name: 'Interactive Toy Set', price: 28, pet: 'Dog', rating: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">PawShop</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Dogs</a>
          <a href="#" className="hover:text-white">Cats</a>
          <a href="#" className="hover:text-white">Auto-Ship</a>
        </div>
        <button className="px-5 py-2 bg-orange-500 text-black text-sm font-semibold rounded-lg">Cart</button>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Everything for your <span className="text-orange-400">best friend</span></h1>
        <p className="text-gray-400 mb-12 max-w-md">Premium pet supplies delivered to your door. Set up auto-ship and never run out.</p>
        <div className="grid grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.name} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-orange-500/5 to-amber-500/5" />
              <div className="p-4">
                <span className="text-xs text-orange-400">{p.pet}</span>
                <h3 className="font-semibold text-sm mt-1">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold">${p.price}</span>
                  <span className="text-xs text-yellow-400">★ {p.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    # ==================== PORTFOLIO (25 designs) ====================
    {
        "name": "Photographer Portfolio",
        "category": "Portfolio",
        "framework": "React",
        "price": "Free",
        "score": 94,
        "description": "Stunning photographer portfolio with masonry grid, lightbox, and contact form.",
        "preview": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
        "code": """export default function PhotographerPortfolio() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-lg font-light tracking-widest">ALEX MORROW</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Work</a>
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-3 gap-4">
          {['from-blue-500/10 to-purple-500/10', 'from-green-500/10 to-teal-500/10', 'from-pink-500/10 to-rose-500/10', 'from-amber-500/10 to-orange-500/10', 'from-indigo-500/10 to-blue-500/10', 'from-violet-500/10 to-purple-500/10'].map((gradient, i) => (
            <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} cursor-pointer hover:opacity-80 transition-opacity`} />
          ))}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-8 py-12 border-t border-white/5 flex items-center justify-between">
        <span className="text-sm text-gray-500">&copy; 2026 Alex Morrow Photography</span>
        <div className="flex gap-4 text-sm text-gray-500">
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">Twitter</a>
          <a href="#" className="hover:text-white">Behance</a>
        </div>
      </footer>
    </div>
  );
}"""
    },
    {
        "name": "Developer Portfolio",
        "category": "Portfolio",
        "framework": "React",
        "price": "Free",
        "score": 92,
        "description": "Developer portfolio with GitHub-style contribution graph, project cards, and blog section.",
        "preview": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
        "code": """export default function DeveloperPortfolio() {
  const projects = [
    { name: 'Open Source CLI', stars: 2340, lang: 'TypeScript' },
    { name: 'React Component Lib', stars: 1890, lang: 'React' },
    { name: 'API Framework', stars: 890, lang: 'Python' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-lg font-mono font-bold">&lt;dev/&gt;</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Projects</a>
          <a href="#" className="hover:text-white">Blog</a>
          <a href="#" className="hover:text-white">GitHub</a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-24">
        <p className="text-green-400 font-mono text-sm mb-4">$ whoami</p>
        <h1 className="text-5xl font-bold mb-6">Full-Stack Developer</h1>
        <p className="text-gray-400 text-lg max-w-lg mb-10">Building tools that make developers' lives easier. Open source enthusiast and coffee addict.</p>

        <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.name} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{p.lang}</span>
                    <span>★ {p.stars}</span>
                  </div>
                </div>
                <span className="text-gray-500">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Designer Portfolio",
        "category": "Portfolio",
        "framework": "React",
        "price": "$19",
        "score": 88,
        "description": "UI/UX designer portfolio with case studies, process showcase, and testimonials.",
        "preview": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
        "code": """export default function DesignerPortfolio() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-lg font-bold">Sarah Kim</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Work</a>
          <a href="#" className="hover:text-white">Process</a>
          <a href="#" className="hover:text-white">About</a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-24">
        <p className="text-purple-400 text-sm mb-4">UI/UX Designer</p>
        <h1 className="text-6xl font-bold tracking-tight mb-6">Designing<br />digital products</h1>
        <p className="text-gray-400 text-lg max-w-lg mb-12">I help startups and companies create intuitive, beautiful digital experiences that users love.</p>

        <div className="space-y-6">
          {[
            { title: 'FinTrack App', desc: 'Mobile banking reimagined', color: 'from-blue-500/10 to-cyan-500/10' },
            { title: 'HealthHub', desc: 'Telehealth platform design', color: 'from-green-500/10 to-emerald-500/10' },
            { title: 'StyleAI', desc: 'AI-powered fashion app', color: 'from-pink-500/10 to-rose-500/10' },
          ].map((project) => (
            <div key={project.title} className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className={`w-full h-48 rounded-xl bg-gradient-to-br ${project.color} mb-6`} />
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-gray-400 mt-1">{project.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Architect Portfolio",
        "category": "Portfolio",
        "framework": "Next.js",
        "price": "$29",
        "score": 86,
        "description": "Architecture firm portfolio with project gallery, team bios, and 3D visualization.",
        "preview": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=500&fit=crop",
        "code": """export default function ArchitectPortfolio() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="text-lg font-light tracking-[0.2em]">STUDIO FORM</div>
        <div className="flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Projects</a>
          <a href="#" className="hover:text-white">Team</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-24">
        <h1 className="text-6xl font-light tracking-tight mb-6">Architecture<br />for <span className="text-gray-500">living</span></h1>
        <p className="text-gray-400 text-lg max-w-lg mb-16">Award-winning architecture studio creating spaces that inspire and endure.</p>

        <div className="grid grid-cols-2 gap-8">
          {['Urban Residence', 'Coastal Villa', 'Office Tower', 'Cultural Center'].map((project, i) => (
            <div key={project} className="group cursor-pointer">
              <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent mb-4" />
              <div className="text-xs text-gray-500">0{i + 1}</div>
              <h3 className="text-lg font-semibold mt-1">{project}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    # ==================== BLOG (20 designs) ====================
    {
        "name": "Tech Blog",
        "category": "Blog",
        "framework": "React",
        "price": "Free",
        "score": 91,
        "description": "Technology blog with article cards, categories, newsletter signup, and dark mode.",
        "preview": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop",
        "code": """export default function TechBlog() {
  const posts = [
    { title: 'The Future of Web Development', date: 'Jan 15, 2026', category: 'Web', readTime: '5 min' },
    { title: 'Building Scalable APIs', date: 'Jan 12, 2026', category: 'Backend', readTime: '8 min' },
    { title: 'Design Systems at Scale', date: 'Jan 10, 2026', category: 'Design', readTime: '6 min' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">DevPulse</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Articles</a>
          <a href="#" className="hover:text-white">Topics</a>
          <a href="#" className="hover:text-white">About</a>
        </div>
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg">Subscribe</button>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-12">Latest Articles</h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.title} className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="px-2 py-1 rounded-full bg-white/5">{post.category}</span>
                <span>{post.date}</span>
                <span>{post.readTime} read</span>
              </div>
              <h2 className="text-xl font-bold">{post.title}</h2>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Personal Blog",
        "category": "Blog",
        "framework": "React",
        "price": "Free",
        "score": 88,
        "description": "Minimal personal blog with large typography, reading progress, and social links.",
        "preview": "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=500&fit=crop",
        "code": """export default function PersonalBlog() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-3xl mx-auto">
        <div className="text-lg font-bold">Thoughts</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Writing</a>
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">RSS</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-bold tracking-tight mb-16">Writing about<br />things I learn</h1>

        <div className="space-y-12">
          {[
            { title: 'On Simplicity', date: 'January 2026', excerpt: 'Why the best solutions are often the simplest ones.' },
            { title: 'Learning in Public', date: 'December 2025', excerpt: 'The benefits of sharing your learning journey.' },
            { title: 'Building Habits', date: 'November 2025', excerpt: 'Small changes that compound into big results.' },
          ].map((post) => (
            <article key={post.title} className="cursor-pointer group">
              <div className="text-xs text-gray-500 mb-2">{post.date}</div>
              <h2 className="text-2xl font-bold group-hover:text-gray-300 transition-colors">{post.title}</h2>
              <p className="text-gray-400 mt-2">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}"""
    },
    {
        "name": "Magazine Blog",
        "category": "Blog",
        "framework": "React",
        "price": "$29",
        "score": 87,
        "description": "Online magazine blog with featured articles, categories, and author profiles.",
        "preview": "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=500&fit=crop",
        "code": """export default function MagazineBlog() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="text-xl font-bold tracking-tight">The Digital</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Technology</a>
          <a href="#" className="hover:text-white">Culture</a>
          <a href="#" className="hover:text-white">Business</a>
          <a href="#" className="hover:text-white">Science</a>
        </div>
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg">Subscribe</button>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
            <span className="text-xs text-blue-400">Featured</span>
            <h2 className="text-3xl font-bold mt-2 mb-3">The Rise of AI in Everyday Life</h2>
            <p className="text-gray-400 mb-4">How artificial intelligence is reshaping the way we work, live, and create.</p>
            <div className="text-xs text-gray-500">By Sarah Chen · 8 min read</div>
          </div>
          <div className="space-y-6">
            {['Quantum Computing Explained', 'Remote Work in 2026', 'The Future of Finance'].map((title) => (
              <div key={title} className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                <h3 className="font-semibold">{title}</h3>
                <div className="text-xs text-gray-500 mt-2">5 min read</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}"""
    },
    # ==================== ADMIN (20 designs) ====================
    {
        "name": "CMS Admin Panel",
        "category": "Admin",
        "framework": "React",
        "price": "$59",
        "score": 90,
        "description": "Content management system admin with page editor, media library, and user roles.",
        "preview": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop",
        "code": """export default function CMSAdmin() {
  const pages = [
    { title: 'Homepage', status: 'Published', updated: '2 hours ago' },
    { title: 'About Us', status: 'Published', updated: '1 day ago' },
    { title: 'Contact', status: 'Draft', updated: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className="w-60 border-r border-white/5 p-5">
        <div className="text-lg font-bold mb-8">CMS Admin</div>
        <nav className="space-y-1 text-sm">
          {['Dashboard', 'Pages', 'Media', 'Users', 'Settings'].map((item) => (
            <a key={item} href="#" className="block px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">{item}</a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Pages</h1>
          <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">+ New Page</button>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-xs text-gray-500 font-medium">Title</th>
                <th className="px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
                <th className="px-5 py-3 text-xs text-gray-500 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.title} className="border-b border-white/5">
                  <td className="px-5 py-3 text-sm font-medium">{p.title}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>{p.status}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-400">{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}"""
    },
    {
        "name": "Support Desk Admin",
        "category": "Admin",
        "framework": "React",
        "price": "$49",
        "score": 87,
        "description": "Customer support admin with ticket management, live chat, and knowledge base.",
        "preview": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=500&fit=crop",
        "code": """export default function SupportDeskAdmin() {
  const tickets = [
    { id: '#TK-4521', subject: 'Login issue', customer: 'John D.', priority: 'High', status: 'Open' },
    { id: '#TK-4520', subject: 'Payment failed', customer: 'Emma S.', priority: 'Critical', status: 'In Progress' },
    { id: '#TK-4519', subject: 'Feature request', customer: 'Mike R.', priority: 'Low', status: 'Resolved' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Support Desk</h1>
        <div className="flex gap-3">
          <span className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-full">3 Open</span>
          <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">+ New Ticket</button>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Ticket</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Subject</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Priority</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-sm font-mono">{t.id}</td>
                <td className="px-5 py-3">
                  <div className="text-sm font-medium">{t.subject}</div>
                  <div className="text-xs text-gray-500">{t.customer}</div>
                </td>
                <td className="px-5 py-3"><span className={`px-2 py-1 text-xs rounded-full ${t.priority === 'Critical' ? 'bg-red-500/10 text-red-400' : t.priority === 'High' ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5'}`}>{t.priority}</span></td>
                <td className="px-5 py-3"><span className="px-2 py-1 text-xs rounded-full bg-white/5">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}"""
    },
    # ==================== MOBILE (25 designs) ====================
    {
        "name": "Food Delivery App",
        "category": "Mobile",
        "framework": "React Native",
        "price": "$59",
        "score": 93,
        "description": "Food delivery mobile app with restaurant listing, cart, and order tracking.",
        "preview": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function FoodDeliveryApp() {
  const [selected, setSelected] = useState(null);
  const restaurants = [
    { name: 'Pizza Palace', rating: 4.8, delivery: '20-30 min', cuisine: 'Italian' },
    { name: 'Sushi Master', rating: 4.9, delivery: '25-35 min', cuisine: 'Japanese' },
    { name: 'Burger Barn', rating: 4.7, delivery: '15-25 min', cuisine: 'American' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white max-w-sm mx-auto border-x border-white/5">
      <div className="p-5">
        <div className="text-xs text-gray-500 mb-1">Deliver to</div>
        <div className="font-semibold flex items-center gap-1">Home <span className="text-gray-500">▾</span></div>
      </div>

      <div className="px-5 mb-6">
        <input placeholder="Search restaurants..." className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm outline-none" />
      </div>

      <div className="px-5 mb-4">
        <h2 className="font-semibold mb-3">Nearby Restaurants</h2>
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div key={r.name} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-4 cursor-pointer hover:bg-white/[0.04]">
              <div className="w-16 h-16 rounded-lg bg-white/[0.05] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{r.name}</h3>
                <div className="text-xs text-gray-500 mt-1">{r.cuisine} · {r.delivery}</div>
                <div className="text-xs text-yellow-400 mt-1">★ {r.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm p-4">
        <button className="w-full h-12 bg-green-500 text-black font-semibold text-sm rounded-xl">View Cart (2)</button>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Fitness Tracker App",
        "category": "Mobile",
        "framework": "React Native",
        "price": "$39",
        "score": 90,
        "description": "Fitness tracking mobile app with workout log, progress charts, and social features.",
        "preview": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=500&fit=crop",
        "code": """export default function FitnessTrackerApp() {
  const workouts = [
    { type: 'Running', duration: '32 min', calories: 320, time: '7:00 AM' },
    { type: 'Weight Training', duration: '45 min', calories: 280, time: '6:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white max-w-sm mx-auto border-x border-white/5">
      <div className="p-5">
        <div className="text-xs text-gray-500 mb-1">Today's Progress</div>
        <h1 className="text-3xl font-bold">600 <span className="text-sm text-gray-500">calories</span></h1>
        <div className="w-full h-2 bg-white/5 rounded-full mt-3">
          <div className="w-3/4 h-full bg-green-500 rounded-full" />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>Goal: 800</span>
        </div>
      </div>

      <div className="px-5">
        <h2 className="font-semibold mb-3">Today's Workouts</h2>
        <div className="space-y-3">
          {workouts.map((w, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{w.type}</div>
                  <div className="text-xs text-gray-500 mt-1">{w.time} · {w.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">{w.calories}</div>
                  <div className="text-xs text-gray-500">kcal</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm p-4">
        <button className="w-full h-12 bg-green-500 text-black font-semibold text-sm rounded-xl">+ Log Workout</button>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Recipe App",
        "category": "Mobile",
        "framework": "React Native",
        "price": "$29",
        "score": 88,
        "description": "Recipe discovery app with ingredient search, meal planning, and cooking timer.",
        "preview": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=500&fit=crop",
        "code": """export default function RecipeApp() {
  const recipes = [
    { name: 'Pasta Carbonara', time: '25 min', difficulty: 'Easy', calories: 520 },
    { name: 'Thai Green Curry', time: '35 min', difficulty: 'Medium', calories: 450 },
    { name: 'Caesar Salad', time: '15 min', difficulty: 'Easy', calories: 320 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white max-w-sm mx-auto border-x border-white/5">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-1">Discover Recipes</h1>
        <p className="text-xs text-gray-500">Find your next favorite dish</p>
      </div>

      <div className="px-5 mb-6">
        <input placeholder="Search by ingredient..." className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm outline-none" />
      </div>

      <div className="px-5">
        <div className="space-y-3">
          {recipes.map((r) => (
            <div key={r.name} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{r.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{r.time}</span>
                  <span>·</span>
                  <span>{r.difficulty}</span>
                </div>
                <div className="text-xs text-orange-400 mt-1">{r.calories} cal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}"""
    },
    # ==================== AUTH (20 designs) ====================
    {
        "name": "Modern Login",
        "category": "Auth",
        "framework": "React",
        "price": "Free",
        "score": 92,
        "description": "Clean modern login page with social auth, forgot password, and remember me.",
        "preview": "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function ModernLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/10 mx-auto mb-4 flex items-center justify-center text-lg font-bold">Z</div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="space-y-3 mb-6">
          <button className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors">
            <span>Continue with Google</span>
          </button>
          <button className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors">
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors" />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <a href="#" className="text-gray-400 hover:text-white">Forgot password?</a>
          </div>
          <button type="submit" className="w-full h-11 bg-white text-black font-semibold text-sm rounded-lg hover:-translate-y-0.5 transition-transform">Sign In</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <a href="#" className="text-white hover:underline">Sign up</a></p>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Register with Steps",
        "category": "Auth",
        "framework": "React",
        "price": "$19",
        "score": 89,
        "description": "Multi-step registration form with progress indicator and validation.",
        "preview": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function RegisterSteps() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="space-y-3">
          {step === 1 && (
            <>
              <input placeholder="Full name" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
              <input type="email" placeholder="Email" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
            </>
          )}
          {step === 2 && (
            <>
              <input placeholder="Company name" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
              <select className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none appearance-none">
                <option>Select role</option>
                <option>Developer</option>
                <option>Designer</option>
                <option>Manager</option>
              </select>
            </>
          )}
          {step === 3 && (
            <>
              <input type="password" placeholder="Create password" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
              <input type="password" placeholder="Confirm password" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 h-11 rounded-lg border border-white/10 text-sm font-semibold text-gray-400">Back</button>}
          <button onClick={() => step < 3 ? setStep(step + 1) : null} className="flex-1 h-11 bg-white text-black font-semibold text-sm rounded-lg">
            {step < 3 ? 'Continue' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}"""
    },
    # ==================== FORM (20 designs) ====================
    {
        "name": "Contact Form",
        "category": "Form",
        "framework": "React",
        "price": "Free",
        "score": 90,
        "description": "Elegant contact form with validation, file upload, and success state.",
        "preview": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 text-green-400 text-2xl">✓</div>
          <h2 className="text-2xl font-bold mb-2">Message Sent</h2>
          <p className="text-gray-400">We'll get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
        <p className="text-gray-400 mb-8">Have a question? We'd love to hear from you.</p>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <input placeholder="Your name" className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors" />
          <input type="email" placeholder="Email address" className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors" />
          <select className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none appearance-none text-gray-400">
            <option>Subject</option>
            <option>General Inquiry</option>
            <option>Support</option>
            <option>Partnership</option>
          </select>
          <textarea placeholder="Your message" rows={5} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors resize-none" />
          <button type="submit" className="w-full h-12 bg-white text-black font-semibold text-sm rounded-lg hover:-translate-y-0.5 transition-transform">Send Message</button>
        </form>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Feedback Survey",
        "category": "Form",
        "framework": "React",
        "price": "$19",
        "score": 87,
        "description": "Multi-step feedback survey with rating scales, text inputs, and progress tracking.",
        "preview": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function FeedbackSurvey() {
  const [step, setStep] = useState(0);
  const questions = [
    'How satisfied are you with our service?',
    'How likely are you to recommend us?',
    'Any additional comments?',
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8">
          {questions.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-white' : 'bg-white/10'}`} />
          ))}
        </div>

        <h2 className="text-xl font-bold mb-8">{questions[step]}</h2>

        {step === 0 && (
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className="flex-1 h-16 rounded-xl border border-white/10 text-lg font-bold hover:bg-white/5 transition-colors">{n}</button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="flex gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button key={n} className="w-10 h-10 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors">{n}</button>
            ))}
          </div>
        )}

        {step === 2 && (
          <textarea placeholder="Tell us more..." rows={5} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm outline-none resize-none" />
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="flex-1 h-12 rounded-lg border border-white/10 text-sm font-semibold text-gray-400">Back</button>}
          <button onClick={() => step < 2 ? setStep(step + 1) : null} className="flex-1 h-12 bg-white text-black font-semibold text-sm rounded-lg">
            {step < 2 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Checkout Form",
        "category": "Form",
        "framework": "React",
        "price": "$29",
        "score": 91,
        "description": "E-commerce checkout form with address, payment, and order summary.",
        "preview": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
        "code": """export default function CheckoutForm() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3 space-y-6">
            <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-3">
                <input placeholder="Full name" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                <input placeholder="Address line 1" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="City" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                  <input placeholder="ZIP code" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
              <h2 className="font-semibold mb-4">Payment</h2>
              <div className="space-y-3">
                <input placeholder="Card number" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                  <input placeholder="CVC" className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] sticky top-8">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {[{ name: 'Product A', price: 49 }, { name: 'Product B', price: 29 }].map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>$78</span>
              </div>
              <button className="w-full h-12 bg-white text-black font-semibold text-sm rounded-lg mt-6">Pay $78</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}"""
    },
]
