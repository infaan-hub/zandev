import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-[70px] pb-[30px]">
      <div className="w-full max-w-[1180px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-[50px]">
          <div>
            <div className="text-[20px] font-bold tracking-[-0.05em]">ZanDev</div>
            <p className="max-w-[280px] mt-[12px] text-[#5d5d5d] text-[9px] leading-[1.7]">
              The design-to-code tool for developers.
              Browse component designs, inspect source code,
              and export clean implementations to any framework.
            </p>
          </div>

          <div>
            <h4 className="text-[#999] text-[9px] mb-[16px]">Product</h4>
            <Link to="/tools" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Features</Link>
            <Link to="/analytics" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Analytics</Link>
            <Link to="/rankings" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Rankings</Link>
            <Link to="/pricing-page" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Pricing</Link>
          </div>

          <div>
            <h4 className="text-[#999] text-[9px] mb-[16px]">Company</h4>
            <Link to="/about" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">About</Link>
            <Link to="/careers" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Careers</Link>
            <Link to="/contact" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Contact</Link>
            <Link to="/blog" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Blog</Link>
          </div>

          <div>
            <h4 className="text-[#999] text-[9px] mb-[16px]">Legal</h4>
            <Link to="/privacy" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Terms</Link>
            <Link to="/security" className="block text-[#555] text-[9px] mb-[11px] hover:text-white transition-colors">Security</Link>
          </div>
        </div>

        <div className="mt-[70px] pt-[20px] border-t border-white/[0.05] flex justify-between text-[#444] text-[8px]">
          <span>© 2026 ZanDev. All rights reserved.</span>
          <span>          Design-to-code tool.</span>
        </div>
      </div>
    </footer>
  )
}
