import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PageLayout({ title, children }) {
  return (
    <>
      <Navbar />
      <main className="pt-[150px] pb-[100px] min-h-screen">
        <div className="w-full max-w-[1180px] mx-auto px-5">
          {title && <h1 className="text-[clamp(35px,5vw,56px)] leading-[0.98] tracking-[-0.06em] font-bold mb-[20px]">{title}</h1>}
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
