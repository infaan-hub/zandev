import { useState, useEffect } from 'react'
import { Star, Send } from 'lucide-react'
import { api } from '../lib/api'

export default function DesignReviews({ designId }) {
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [count, setCount] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const loadReviews = async () => {
    try {
      const data = await api.getReviews(designId)
      setReviews(data.reviews || [])
      setAvgRating(data.avg_rating)
      setCount(data.count || 0)
    } catch {}
  }

  useEffect(() => { if (designId) loadReviews() }, [designId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      await api.createReview(designId, { rating, comment })
      setComment('')
      setRating(5)
      loadReviews()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{avgRating ? avgRating.toFixed(1) : '-'}</div>
          <div className="flex gap-0.5 my-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={12} className={i <= Math.round(avgRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-[#333]'} />
            ))}
          </div>
          <div className="text-[10px] text-[#555]">{count} reviews</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-0.5 mb-2">
          {[1,2,3,4,5].map(i => (
            <button key={i} type="button" onMouseEnter={() => setHoveredStar(i)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRating(i)}>
              <Star size={16} className={`transition-colors ${(hoveredStar || rating) >= i ? 'text-yellow-400 fill-yellow-400' : 'text-[#333]'}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
          className="w-full px-2 py-1.5 rounded bg-white/[0.03] text-white text-xs outline-none border border-white/[0.06] focus:border-white/20 resize-none placeholder-[#444]"
          placeholder="Write a review..." />
        <button type="submit" disabled={submitting || !comment.trim()}
          className="mt-2 flex items-center gap-1 px-3 py-1 rounded bg-white text-black text-[10px] font-semibold disabled:opacity-50">
          <Send size={10} /> Submit
        </button>
      </form>

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-white">{r.user}</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={10} className={i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#333]'} />
                ))}
              </div>
              <span className="text-[9px] text-[#555] ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-[#888]">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
