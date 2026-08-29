import json
from django.core.management.base import BaseCommand
from designs_app.models import Design
from designs_app.management.commands.seed_extra import EXTRA_DESIGNS


DESIGNS = [
    # ==================== LANDING (40 designs) ====================
    {
        "name": "SaaS Launch Landing",
        "category": "Landing",
        "framework": "React",
        "price": "Free",
        "score": 95,
        "description": "Modern SaaS product launch page with hero, features grid, pricing, and CTA sections.",
        "preview": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function SaaSLaunch() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">LaunchPad</div>
        <div className="flex gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </div>
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:-translate-y-0.5 transition-transform">Get Started</button>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-32 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-gray-400">Now in public beta</div>
        <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">Ship products<br /><span className="text-gray-500">10x faster</span></h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">The all-in-one platform that helps teams build, test, and deploy products with confidence.</p>
        <div className="flex justify-center gap-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-72 h-12 px-5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors" />
          <button className="h-12 px-8 bg-white text-black font-semibold text-sm rounded-lg hover:-translate-y-0.5 transition-transform">Start Free</button>
        </div>
      </section>

      <section id="features" className="max-w-5xl mx-auto px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-16">Everything you need</h2>
        <div className="grid grid-cols-3 gap-8">
          {['Deploy in seconds', 'Auto-scaling', 'Real-time analytics', 'Team collaboration', 'Custom domains', 'SSL certificates'].map((f) => (
            <div key={f} className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-sm font-bold">{f[0]}</div>
              <h3 className="font-semibold mb-2">{f}</h3>
              <p className="text-sm text-gray-500">Built for modern development workflows.</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-gray-500">
        &copy; 2026 LaunchPad. All rights reserved.
      </footer>
    </div>
  );
}"""
    },
    {
        "name": "AI Startup Hero",
        "category": "Landing",
        "framework": "React",
        "price": "$29",
        "score": 92,
        "description": "AI-powered startup landing page with animated gradient hero and feature showcase.",
        "preview": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
        "code": """export default function AIStartup() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">NeuralAI</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Product</a>
          <a href="#" className="hover:text-white">Research</a>
          <a href="#" className="hover:text-white">Blog</a>
        </div>
        <button className="px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-sm font-semibold rounded-lg">Try Demo</button>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-40 text-center">
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-6">The future of<br /><span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">intelligence</span></h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">Build, train, and deploy AI models at scale. No infrastructure headaches.</p>
        <div className="flex justify-center gap-3">
          <button className="h-12 px-8 bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-sm rounded-lg">Start Building</button>
          <button className="h-12 px-8 border border-white/10 text-gray-300 font-semibold text-sm rounded-lg hover:bg-white/5">View Docs</button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: 'Text Generation', desc: 'Create human-like text for any use case' },
            { title: 'Image Analysis', desc: 'Understand and describe visual content' },
            { title: 'Code Generation', desc: 'Write and debug code automatically' },
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Crypto Exchange Landing",
        "category": "Landing",
        "framework": "React",
        "price": "$49",
        "score": 88,
        "description": "Cryptocurrency exchange landing page with live ticker, trading pairs, and signup form.",
        "preview": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function CryptoExchange() {
  const pairs = [
    { symbol: 'BTC/USDT', price: '67,234.50', change: '+2.4%', up: true },
    { symbol: 'ETH/USDT', price: '3,456.78', change: '+1.8%', up: true },
    { symbol: 'SOL/USDT', price: '178.90', change: '-0.5%', up: false },
    { symbol: 'ADA/USDT', price: '0.6234', change: '+3.1%', up: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">CryptoFlow</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Markets</a>
          <a href="#" className="hover:text-white">Trade</a>
          <a href="#" className="hover:text-white">Earn</a>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 border border-white/10 text-sm rounded-lg text-gray-300">Log In</button>
          <button className="px-5 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg">Sign Up</button>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold mb-4">Trade smarter,<br />earn more</h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md">The most trusted cryptocurrency exchange with over 10M users worldwide.</p>
        <div className="grid grid-cols-4 gap-4 mb-16">
          {pairs.map((p) => (
            <div key={p.symbol} className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-sm text-gray-400 mb-1">{p.symbol}</div>
              <div className="text-xl font-bold">${p.price}</div>
              <div className={`text-sm mt-1 ${p.up ? 'text-green-400' : 'text-red-400'}`}>{p.change}</div>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] max-w-md">
          <h2 className="text-xl font-bold mb-6">Create Account</h2>
          <input type="email" placeholder="Email" className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-sm mb-3 outline-none focus:border-white/30" />
          <input type="password" placeholder="Password" className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-sm mb-4 outline-none focus:border-white/30" />
          <button className="w-full h-12 bg-yellow-500 text-black font-semibold text-sm rounded-lg">Get Started</button>
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Portfolio Minimal",
        "category": "Landing",
        "framework": "React",
        "price": "Free",
        "score": 90,
        "description": "Clean minimal portfolio landing with large typography and smooth scroll sections.",
        "preview": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop",
        "code": """export default function PortfolioMinimal() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-lg font-bold">John Doe</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#work" className="hover:text-white">Work</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-32">
        <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest">Designer & Developer</p>
        <h1 className="text-7xl font-bold tracking-tight mb-8 leading-[0.95]">I craft digital<br />experiences</h1>
        <p className="text-gray-400 text-lg max-w-lg">Currently available for freelance projects. Let's build something remarkable together.</p>
      </section>

      <section id="work" className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold mb-12">Selected Work</h2>
        <div className="grid grid-cols-2 gap-6">
          {['Brand Identity', 'Web Application', 'Mobile App', 'Design System'].map((project, i) => (
            <div key={project} className="group aspect-[4/3] rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-xs text-gray-400">0{i + 1}</span>
                <h3 className="text-lg font-semibold mt-1">{project}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="max-w-4xl mx-auto px-8 py-20 border-t border-white/5">
        <h2 className="text-4xl font-bold mb-4">Let's talk</h2>
        <a href="mailto:hello@example.com" className="text-gray-400 hover:text-white text-lg transition-colors">hello@example.com</a>
      </footer>
    </div>
  );
}"""
    },
    {
        "name": "Agency Showcase",
        "category": "Landing",
        "framework": "Next.js",
        "price": "$39",
        "score": 87,
        "description": "Creative agency landing page with portfolio grid, team section, and contact form.",
        "preview": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
        "code": """export default function AgencyShowcase() {
  const projects = [
    { title: 'Rebrand Campaign', client: 'TechCorp' },
    { title: 'Product Launch', client: 'InnovateCo' },
    { title: 'Digital Experience', client: 'MediaHub' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">StudioX</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Work</a>
          <a href="#" className="hover:text-white">Services</a>
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-32">
        <h1 className="text-6xl font-bold tracking-tight mb-6">We design<br /><span className="text-gray-500">brands that matter</span></h1>
        <p className="text-gray-400 text-lg max-w-lg mb-10">Full-service creative agency specializing in brand strategy, digital design, and immersive experiences.</p>
        <button className="h-12 px-8 bg-white text-black font-semibold text-sm rounded-lg">View Our Work</button>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold mb-12">Featured Projects</h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.title} className="flex items-center justify-between p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.client}</p>
              </div>
              <span className="text-gray-500">→</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold mb-12">Our Team</h2>
        <div className="grid grid-cols-4 gap-6">
          {['Sarah Chen', 'Marcus Lee', 'Priya Patel', 'Alex Rivera'].map((name) => (
            <div key={name} className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-3" />
              <div className="font-semibold text-sm">{name}</div>
              <div className="text-xs text-gray-500">Designer</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "EduTech Platform",
        "category": "Landing",
        "framework": "React",
        "price": "Free",
        "score": 85,
        "description": "Online learning platform landing with course cards, instructor profiles, and enrollment CTA.",
        "preview": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop",
        "code": """export default function EduTech() {
  const courses = [
    { title: 'React Mastery', students: '12.5K', rating: '4.9' },
    { title: 'Python for Data Science', students: '8.3K', rating: '4.8' },
    { title: 'UI/UX Design Fundamentals', students: '6.7K', rating: '4.7' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">LearnHub</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Courses</a>
          <a href="#" className="hover:text-white">Instructors</a>
          <a href="#" className="hover:text-white">Pricing</a>
        </div>
        <button className="px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg">Enroll Now</button>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">Learn without<br /><span className="text-blue-400">limits</span></h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">Join over 50,000 students learning to code with expert-led courses and hands-on projects.</p>
        <button className="h-12 px-8 bg-blue-500 font-semibold text-sm rounded-lg">Browse Courses</button>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold mb-12">Popular Courses</h2>
        <div className="grid grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.title} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <div className="p-5">
                <h3 className="font-semibold mb-2">{c.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{c.students} students</span>
                  <span>★ {c.rating}</span>
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
        "name": "Fitness App Landing",
        "category": "Landing",
        "framework": "React Native",
        "price": "$29",
        "score": 86,
        "description": "Fitness app landing page with workout preview, stats dashboard, and download buttons.",
        "preview": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop",
        "code": """export default function FitnessApp() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-xl font-bold text-green-400">FitPro</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Workouts</a>
          <a href="#" className="hover:text-white">Plans</a>
          <a href="#" className="hover:text-white">Community</a>
        </div>
        <button className="px-5 py-2 bg-green-500 text-black text-sm font-semibold rounded-lg">Download Free</button>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-24 flex items-center gap-16">
        <div className="flex-1">
          <div className="inline-block px-3 py-1 mb-4 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/20">New: AI Workouts</div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">Your fitness,<br />redefined</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">Personalized workout plans, nutrition tracking, and progress analytics — all in one app.</p>
          <div className="flex gap-3">
            <button className="h-12 px-6 bg-green-500 text-black font-semibold text-sm rounded-lg">Get Started</button>
            <button className="h-12 px-6 border border-white/10 text-gray-300 font-semibold text-sm rounded-lg">Watch Demo</button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl font-bold text-green-400">847</div>
            <div className="text-xs text-gray-500 mt-1">Workouts Done</div>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl font-bold text-green-400">12.5K</div>
            <div className="text-xs text-gray-500 mt-1">Calories Burned</div>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl font-bold text-green-400">94%</div>
            <div className="text-xs text-gray-500 mt-1">Goal Progress</div>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl font-bold text-green-400">23</div>
            <div className="text-xs text-gray-500 mt-1">Day Streak</div>
          </div>
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Restaurant Booking",
        "category": "Landing",
        "framework": "React",
        "price": "$19",
        "score": 84,
        "description": "Restaurant landing page with menu preview, reservation form, and gallery section.",
        "preview": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop",
        "code": """import { useState } from 'react';

export default function RestaurantBooking() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-xl font-bold">La Maison</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Menu</a>
          <a href="#" className="hover:text-white">Gallery</a>
          <a href="#" className="hover:text-white">Reservations</a>
        </div>
        <button className="px-5 py-2 border border-white/10 text-sm rounded-lg text-gray-300">Book a Table</button>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-32 text-center">
        <p className="text-amber-400 text-sm tracking-widest uppercase mb-4">Fine Dining Experience</p>
        <h1 className="text-6xl font-bold tracking-tight mb-6">Taste the<br /><span className="text-amber-400">extraordinary</span></h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">Award-winning cuisine crafted with passion. Reserve your table for an unforgettable evening.</p>
        <button className="h-12 px-8 bg-amber-500 text-black font-semibold text-sm rounded-lg">Reserve Now</button>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Menu</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: 'Wagyu Tartare', price: '$48', desc: 'Hand-cut wagyu with truffle aioli' },
            { name: 'Lobster Risotto', price: '$62', desc: 'Maine lobster with saffron risotto' },
            { name: 'Chocolate Soufflé', price: '$24', desc: 'Dark chocolate with vanilla ice cream' },
          ].map((item) => (
            <div key={item.name} className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              <div className="text-amber-400 font-bold mt-3">{item.price}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}"""
    },
    {
        "name": "Real Estate Platform",
        "category": "Landing",
        "framework": "React",
        "price": "$49",
        "score": 89,
        "description": "Real estate platform with property cards, search filters, and agent profiles.",
        "preview": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
        "code": """export default function RealEstate() {
  const properties = [
    { title: 'Modern Loft', price: '$425,000', beds: 2, baths: 1, sqft: '1,200' },
    { title: 'Suburban Home', price: '$650,000', beds: 4, baths: 3, sqft: '2,800' },
    { title: 'City Studio', price: '$275,000', beds: 1, baths: 1, sqft: '650' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">HomeFind</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Buy</a>
          <a href="#" className="hover:text-white">Rent</a>
          <a href="#" className="hover:text-white">Sell</a>
        </div>
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg">List Property</button>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-24">
        <h1 className="text-5xl font-bold tracking-tight mb-6">Find your<br />perfect home</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md">Browse thousands of properties across the country with detailed listings and virtual tours.</p>
        <div className="flex gap-3 mb-16">
          <input placeholder="City, neighborhood, or address" className="flex-1 h-12 px-5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none" />
          <button className="h-12 px-8 bg-white text-black font-semibold text-sm rounded-lg">Search</button>
        </div>

        <h2 className="text-2xl font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.title} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="h-48 bg-white/[0.03]" />
              <div className="p-5">
                <div className="text-xl font-bold">${p.price}</div>
                <div className="font-semibold mt-1">{p.title}</div>
                <div className="text-xs text-gray-500 mt-2">{p.beds} beds · {p.baths} baths · {p.sqft} sqft</div>
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
        "name": "Music Streaming App",
        "category": "Landing",
        "framework": "React",
        "price": "$39",
        "score": 91,
        "description": "Music streaming app landing with playlist preview, player widget, and subscription plans.",
        "preview": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=500&fit=crop",
        "code": """export default function MusicStreaming() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-xl font-bold text-purple-400">SoundWave</div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Discover</a>
          <a href="#" className="hover:text-white">Library</a>
          <a href="#" className="hover:text-white">Premium</a>
        </div>
        <button className="px-5 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg">Start Free Trial</button>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-32 flex items-center gap-16">
        <div className="flex-1">
          <h1 className="text-6xl font-bold tracking-tight mb-6">Listen to<br /><span className="text-purple-400">everything</span></h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">Over 80 million songs. Ad-free. Offline listening. High-quality audio.</p>
          <button className="h-12 px-8 bg-purple-500 font-semibold text-sm rounded-lg">Try Premium Free</button>
        </div>
        <div className="flex-1 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="text-sm text-gray-500 mb-4">Now Playing</div>
          <div className="w-full h-48 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4" />
          <div className="font-semibold">Midnight Dreams</div>
          <div className="text-sm text-gray-500">Luna Eclipse</div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-4">
            <div className="w-1/3 h-full bg-purple-500 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1:24</span>
            <span>4:12</span>
          </div>
        </div>
      </section>
    </div>
  );
}"""
    },
    # ==================== DASHBOARD (30 designs) ====================
    {
        "name": "Analytics Dashboard",
        "category": "Dashboard",
        "framework": "React",
        "price": "$49",
        "score": 94,
        "description": "Comprehensive analytics dashboard with charts, metrics cards, and data tables.",
        "preview": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
        "code": """export default function AnalyticsDashboard() {
  const metrics = [
    { label: 'Total Revenue', value: '$48,290', change: '+12.5%' },
    { label: 'Active Users', value: '2,847', change: '+8.2%' },
    { label: 'Conversion Rate', value: '3.24%', change: '+1.1%' },
    { label: 'Avg. Session', value: '4m 32s', change: '-2.3%' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs border border-white/10 rounded-lg text-gray-400">Last 7 days</button>
          <button className="px-4 py-2 text-xs bg-white text-black font-semibold rounded-lg">Export</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className="text-2xl font-bold">{m.value}</div>
            <div className={`text-xs mt-1 ${m.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{m.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-sm font-semibold mb-4">Revenue Overview</div>
          <div className="h-64 flex items-end gap-2">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-white/10 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-sm font-semibold mb-4">Top Pages</div>
          <div className="space-y-3">
            {['/dashboard', '/settings', '/analytics', '/profile'].map((page) => (
              <div key={page} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{page}</span>
                <span className="font-medium">{Math.floor(Math.random() * 5000)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "CRM Dashboard",
        "category": "Dashboard",
        "framework": "React",
        "price": "$59",
        "score": 91,
        "description": "Customer relationship management dashboard with pipeline, contacts, and deal tracking.",
        "preview": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        "code": """export default function CRMDashboard() {
  const deals = [
    { name: 'Acme Corp', value: '$24,000', stage: 'Negotiation' },
    { name: 'TechStart', value: '$18,500', stage: 'Proposal' },
    { name: 'GlobalCo', value: '$42,000', stage: 'Closed Won' },
    { name: 'Innovate Ltd', value: '$8,750', stage: 'Discovery' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">CRM</h1>
        <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">+ New Deal</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Deals', value: '142' },
          { label: 'Won This Month', value: '23' },
          { label: 'Pipeline Value', value: '$1.2M' },
          { label: 'Avg. Deal Size', value: '$8,450' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Deal</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Value</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Stage</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.name} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-sm font-medium">{d.name}</td>
                <td className="px-5 py-3 text-sm">{d.value}</td>
                <td className="px-5 py-3"><span className="px-2 py-1 text-xs rounded-full bg-white/5">{d.stage}</span></td>
                <td className="px-5 py-3"><button className="text-xs text-gray-400 hover:text-white">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Project Management",
        "category": "Dashboard",
        "framework": "React",
        "price": "$39",
        "score": 90,
        "description": "Kanban-style project management dashboard with task cards and team overview.",
        "preview": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop",
        "code": """export default function ProjectManagement() {
  const columns = [
    { title: 'To Do', color: 'bg-gray-500', tasks: ['Design system update', 'API integration'] },
    { title: 'In Progress', color: 'bg-blue-500', tasks: ['User authentication', 'Dashboard layout'] },
    { title: 'Review', color: 'bg-yellow-500', tasks: ['Landing page'] },
    { title: 'Done', color: 'bg-green-500', tasks: ['Database setup', 'CI/CD pipeline', 'Testing suite'] },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Sprint Board</h1>
        <div className="flex gap-3 items-center">
          <div className="flex -space-x-2">
            {['bg-blue-500', 'bg-green-500', 'bg-purple-500'].map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#0a0a0a]`} />
            ))}
          </div>
          <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">+ Add Task</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.title}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="text-sm font-semibold">{col.title}</span>
              <span className="text-xs text-gray-500">{col.tasks.length}</span>
            </div>
            <div className="space-y-3">
              {col.tasks.map((task) => (
                <div key={task} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="text-sm">{task}</div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-5 h-5 rounded-full bg-white/10" />
                    <span className="text-xs text-gray-500">2d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "E-Commerce Admin",
        "category": "Dashboard",
        "framework": "React",
        "price": "$49",
        "score": 88,
        "description": "E-commerce admin panel with order management, inventory, and sales analytics.",
        "preview": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
        "code": """export default function ECommerceAdmin() {
  const orders = [
    { id: '#ORD-7291', customer: 'Sarah Johnson', total: '$234.50', status: 'Shipped' },
    { id: '#ORD-7290', customer: 'Mike Chen', total: '$89.99', status: 'Processing' },
    { id: '#ORD-7289', customer: 'Emma Wilson', total: '$312.00', status: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">E-Commerce Admin</h1>
        <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">+ Add Product</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sales', value: '$24,890' },
          { label: 'Orders', value: '342' },
          { label: 'Products', value: '156' },
          { label: 'Customers', value: '1,234' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 text-sm font-semibold">Recent Orders</div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Order ID</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Customer</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Total</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5">
                <td className="px-5 py-3 text-sm font-mono">{o.id}</td>
                <td className="px-5 py-3 text-sm">{o.customer}</td>
                <td className="px-5 py-3 text-sm">{o.total}</td>
                <td className="px-5 py-3"><span className="px-2 py-1 text-xs rounded-full bg-white/5">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Social Media Dashboard",
        "category": "Dashboard",
        "framework": "React",
        "price": "$29",
        "score": 87,
        "description": "Social media management dashboard with post scheduler, analytics, and engagement metrics.",
        "preview": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
        "code": """export default function SocialDashboard() {
  const posts = [
    { platform: 'Twitter', content: 'Excited to announce our new feature!', engagement: '2.4K', time: '2h ago' },
    { platform: 'Instagram', content: 'Behind the scenes at our office', engagement: '5.1K', time: '4h ago' },
    { platform: 'LinkedIn', content: 'We are hiring! Check out our open roles', engagement: '1.8K', time: '6h ago' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Social Media</h1>
        <button className="px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg">+ Schedule Post</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Followers', value: '24.5K' },
          { label: 'Engagement Rate', value: '4.2%' },
          { label: 'Posts This Week', value: '12' },
          { label: 'Reach', value: '89.3K' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 text-sm font-semibold">Scheduled Posts</div>
        <div className="divide-y divide-white/5">
          {posts.map((p, i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02]">
              <div>
                <span className="text-xs text-blue-400 font-medium">{p.platform}</span>
                <div className="text-sm mt-1">{p.content}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{p.engagement} engaged</div>
                <div className="text-xs text-gray-500">{p.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Finance Dashboard",
        "category": "Dashboard",
        "framework": "React",
        "price": "$59",
        "score": 92,
        "description": "Financial dashboard with portfolio tracking, transaction history, and budget overview.",
        "preview": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop",
        "code": """export default function FinanceDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Finance</h1>
        <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">Transfer</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-xs text-gray-500">Total Balance</div>
          <div className="text-3xl font-bold mt-1">$84,290</div>
          <div className="text-xs text-green-400 mt-1">+12.5% this month</div>
        </div>
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-xs text-gray-500">Income</div>
          <div className="text-3xl font-bold mt-1">$12,450</div>
          <div className="text-xs text-green-400 mt-1">+8.2% vs last month</div>
        </div>
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-xs text-gray-500">Expenses</div>
          <div className="text-3xl font-bold mt-1">$4,230</div>
          <div className="text-xs text-red-400 mt-1">+3.1% vs last month</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-sm font-semibold mb-4">Recent Transactions</div>
          <div className="space-y-3">
            {[
              { name: 'Netflix', amount: '-$15.99', date: 'Today' },
              { name: 'Salary Deposit', amount: '+$4,500', date: 'Yesterday' },
              { name: 'Amazon', amount: '-$89.50', date: '2 days ago' },
            ].map((t) => (
              <div key={t.name} className="flex items-center justify-between text-sm">
                <div>
                  <div>{t.name}</div>
                  <div className="text-xs text-gray-500">{t.date}</div>
                </div>
                <div className={t.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{t.amount}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-sm font-semibold mb-4">Budget Overview</div>
          <div className="space-y-4">
            {[
              { category: 'Housing', spent: 2000, budget: 2500 },
              { category: 'Food', spent: 800, budget: 1000 },
              { category: 'Transport', spent: 300, budget: 500 },
            ].map((b) => (
              <div key={b.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{b.category}</span>
                  <span className="text-gray-500">${b.spent}/${b.budget}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full">
                  <div className="h-full bg-white/20 rounded-full" style={{ width: `${(b.spent / b.budget) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Healthcare Dashboard",
        "category": "Dashboard",
        "framework": "React",
        "price": "$69",
        "score": 89,
        "description": "Healthcare admin dashboard with patient records, appointments, and medical metrics.",
        "preview": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
        "code": """export default function HealthcareDashboard() {
  const patients = [
    { name: 'John Smith', age: 45, status: 'Active', lastVisit: '2 days ago' },
    { name: 'Emily Davis', age: 32, status: 'Active', lastVisit: '1 week ago' },
    { name: 'Robert Wilson', age: 67, status: 'Critical', lastVisit: 'Today' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Healthcare Portal</h1>
        <button className="px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg">+ New Appointment</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Patients', value: '1,234' },
          { label: 'Today\'s Appointments', value: '28' },
          { label: 'Critical Cases', value: '5' },
          { label: 'Avg. Wait Time', value: '12 min' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 text-sm font-semibold">Patient Records</div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Patient</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Age</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.name} className="border-b border-white/5">
                <td className="px-5 py-3 text-sm font-medium">{p.name}</td>
                <td className="px-5 py-3 text-sm">{p.age}</td>
                <td className="px-5 py-3"><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-white/5'}`}>{p.status}</span></td>
                <td className="px-5 py-3 text-sm text-gray-400">{p.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "DevOps Dashboard",
        "category": "Dashboard",
        "framework": "React",
        "price": "$49",
        "score": 88,
        "description": "DevOps monitoring dashboard with deployment status, server health, and CI/CD pipeline.",
        "preview": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
        "code": """export default function DevOpsDashboard() {
  const deployments = [
    { service: 'API Gateway', status: 'Healthy', uptime: '99.99%', version: 'v2.4.1' },
    { service: 'Auth Service', status: 'Healthy', uptime: '99.95%', version: 'v1.8.3' },
    { service: 'Payment Service', status: 'Degraded', uptime: '99.20%', version: 'v3.1.0' },
    { service: 'Notification', status: 'Healthy', uptime: '99.98%', version: 'v2.0.5' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">DevOps Monitor</h1>
        <button className="px-4 py-2 bg-green-500 text-black text-xs font-semibold rounded-lg">Deploy</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Uptime', value: '99.97%' },
          { label: 'Deployments Today', value: '12' },
          { label: 'Active Alerts', value: '3' },
          { label: 'Avg Response', value: '45ms' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 text-sm font-semibold">Service Status</div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Service</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Uptime</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Version</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((d) => (
              <tr key={d.service} className="border-b border-white/5">
                <td className="px-5 py-3 text-sm font-medium">{d.service}</td>
                <td className="px-5 py-3"><span className={`px-2 py-1 text-xs rounded-full ${d.status === 'Degraded' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>{d.status}</span></td>
                <td className="px-5 py-3 text-sm">{d.uptime}</td>
                <td className="px-5 py-3 text-sm font-mono text-gray-400">{d.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "HR Dashboard",
        "category": "Dashboard",
        "framework": "Vue",
        "price": "$39",
        "score": 86,
        "description": "Human resources dashboard with employee directory, leave management, and recruitment pipeline.",
        "preview": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop",
        "code": """export default function HRDashboard() {
  const employees = [
    { name: 'Alice Johnson', role: 'Engineering', status: 'Active', joinDate: 'Jan 2024' },
    { name: 'Bob Williams', role: 'Design', status: 'On Leave', joinDate: 'Mar 2023' },
    { name: 'Carol Brown', role: 'Marketing', status: 'Active', joinDate: 'Sep 2024' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">HR Portal</h1>
        <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg">+ Add Employee</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Employees', value: '156' },
          { label: 'Open Positions', value: '8' },
          { label: 'On Leave', value: '12' },
          { label: 'Avg. Tenure', value: '2.4 yrs' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 text-sm font-semibold">Employee Directory</div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Name</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Role</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
              <th className="px-5 py-3 text-xs text-gray-500 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.name} className="border-b border-white/5">
                <td className="px-5 py-3 text-sm font-medium">{e.name}</td>
                <td className="px-5 py-3 text-sm text-gray-400">{e.role}</td>
                <td className="px-5 py-3"><span className={`px-2 py-1 text-xs rounded-full ${e.status === 'On Leave' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/5'}`}>{e.status}</span></td>
                <td className="px-5 py-3 text-sm text-gray-400">{e.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}"""
    },
]


ALL_DESIGNS = DESIGNS + EXTRA_DESIGNS


def _gen_more():
    """Generate additional design entries to reach 200."""
    base_names = [
        'Landing Page', 'SaaS Dashboard', 'Portfolio Site', 'Blog Theme',
        'E-Commerce Store', 'Admin Panel', 'Mobile App', 'Auth Page',
        'Contact Form', 'Pricing Page', 'Documentation', 'Changelog',
        'Job Board', 'Forum', 'Wiki', 'Chat App', 'Email Template',
        'Invoice Generator', 'Calendar App', 'Task Manager', 'Note App',
        'Weather App', 'Calculator', 'Quiz App', 'Survey Tool',
    ]
    categories = ['Landing', 'Dashboard', 'Portfolio', 'Blog', 'E-Commerce', 'Admin', 'Mobile', 'Auth', 'Form']
    frameworks = ['React', 'Next.js', 'Vue', 'Astro', 'Svelte', 'React Native']
    prices = ['Free', '$19', '$29', '$39', '$49', '$59', '$69']
    images = [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop',
    ]

    more = []
    for i in range(180):
        suffix = ' Pro' if i % 3 == 0 else ' Lite' if i % 3 == 1 else ' Plus'
        name = f"{base_names[i % len(base_names)]}{suffix}"
        cat = categories[i % len(categories)]
        fw = frameworks[i % len(frameworks)]
        pr = prices[i % len(prices)]
        img = images[i % len(images)]
        score = max(60, 95 - (i % 30))

        safe_name = name.replace(' ', '').replace('-', '')
        code = (
            f"export default function {safe_name}() {{\n"
            f"  return (\n"
            f"    <div className=\"min-h-screen bg-[#0a0a0a] text-white p-8\">\n"
            f"      <nav className=\"flex items-center justify-between mb-12\">\n"
            f"        <div className=\"text-xl font-bold\">{name}</div>\n"
            f"        <div className=\"flex gap-4 text-sm text-gray-400\">\n"
            f"          <a href=\"#\" className=\"hover:text-white\">Home</a>\n"
            f"          <a href=\"#\" className=\"hover:text-white\">Features</a>\n"
            f"          <a href=\"#\" className=\"hover:text-white\">Pricing</a>\n"
            f"        </div>\n"
            f"      </nav>\n"
            f"      <section className=\"max-w-4xl\">\n"
            f"        <h1 className=\"text-5xl font-bold tracking-tight mb-6\">{name}</h1>\n"
            f"        <p className=\"text-gray-400 text-lg max-w-lg mb-8\">A beautiful, production-ready {cat.lower()} component built with {fw} and Tailwind CSS.</p>\n"
            f"        <div className=\"flex gap-3\">\n"
            f"          <button className=\"px-6 py-3 bg-white text-black font-semibold text-sm rounded-lg\">Get Started</button>\n"
            f"          <button className=\"px-6 py-3 border border-white/10 text-gray-300 text-sm rounded-lg\">Learn More</button>\n"
            f"        </div>\n"
            f"      </section>\n"
            f"      <section className=\"grid grid-cols-3 gap-6 mt-20\">\n"
            f"        {{['Feature One', 'Feature Two', 'Feature Three'].map((f) => (\n"
            f"          <div key={{f}} className=\"p-6 rounded-xl border border-white/5 bg-white/[0.02]\">\n"
            f"            <div className=\"w-10 h-10 rounded-lg bg-white/10 mb-4\" />\n"
            f"            <h3 className=\"font-semibold mb-2\">{{f}}</h3>\n"
            f"            <p className=\"text-sm text-gray-500\">Description of this feature goes here.</p>\n"
            f"          </div>\n"
            f"        ))}}\n"
            f"      </section>\n"
            f"    </div>\n"
            f"  );\n"
            f"}}"
        )

        more.append({
            "name": name,
            "category": cat,
            "framework": fw,
            "price": pr,
            "score": score,
            "description": f"Production-ready {cat.lower()} component. Clean design, responsive, and easy to customize.",
            "preview": img,
            "code": code,
        })
    return more


class Command(BaseCommand):
    help = 'Seed database with 200 design templates'

    def handle(self, *args, **options):
        extra = _gen_more()
        all_designs = ALL_DESIGNS + extra

        created = 0
        updated = 0
        for d in all_designs:
            obj, was_created = Design.objects.update_or_create(
                name=d['name'],
                defaults={
                    'category': d['category'],
                    'framework': d['framework'],
                    'price': d['price'],
                    'score': d['score'],
                    'description': d['description'],
                    'preview_image': d['preview'],
                    'code': d['code'],
                    'file_type': 'url',
                }
            )
            if was_created:
                created += 1
            else:
                updated += 1

        total = Design.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f'Done! Created: {created}, Updated: {updated}, Total in DB: {total}'
        ))
