import { useState } from 'react'
import { Heart, MessageSquare, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { feedbackApi } from '../../api/feedbackApi'
import { loveApi } from '../../api/loveApi'

export default function Footer() {
    const { user } = useAuth()
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const [feedbackText, setFeedbackText] = useState('')
    const [feedbackLoading, setFeedbackLoading] = useState(false)
    const [loveLoading, setLoveLoading] = useState(false)
    const [loveSuccess, setLoveSuccess] = useState(false)

    const showNotification = (message, type = 'success') => {
        const toast = document.createElement('div')
        const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        toast.className = `fixed bottom-6 right-6 ${bgColor} text-white px-4 py-3 rounded-lg text-sm z-50 shadow-lg animate-fade-in`
        toast.innerHTML = message
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
    }

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault()
        if (!feedbackText.trim()) return
        setFeedbackLoading(true)
        try {
            await feedbackApi.create({ message: feedbackText })
            setFeedbackText('')
            setFeedbackOpen(false)
            showNotification('✓ Thank you for your feedback!')
        } catch (err) {
            showNotification('Failed to send feedback', 'error')
        } finally {
            setFeedbackLoading(false)
        }
    }

    const handleSendLove = async () => {
        setLoveLoading(true)
        try {
            await loveApi.send()
            setLoveSuccess(true)
            showNotification('❤️ Love sent to Sourav!')
            setTimeout(() => setLoveSuccess(false), 3000)
        } catch (err) {
            showNotification('Failed to send love', 'error')
        } finally {
            setLoveLoading(false)
        }
    }

    return (
        <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Left: App Branding */}
                    <div className="flex items-center gap-3">
                        <img src="/assets/logo.png" alt="JobTrack" className="h-6 w-auto" />
                        <div>
                            <p className="font-display font-bold text-sm text-slate-900 dark:text-white">JobTrack</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Career made simple</p>
                        </div>
                    </div>

                    {/* Center: Creator + Love */}
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Created by <span className="font-semibold text-brand-600 dark:text-accent-400">Sourav Gorai</span>
                        </p>
                        <button
                            onClick={handleSendLove}
                            disabled={loveLoading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                loveSuccess
                                    ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
                            }`}
                        >
                            <Heart className={`h-3.5 w-3.5 ${loveSuccess ? 'fill-current' : ''}`} />
                            {loveLoading ? 'Sending...' : 'Send Love'}
                        </button>
                    </div>

                    {/* Right: Feedback */}
                    <div className="relative">
                        <button
                            onClick={() => setFeedbackOpen(!feedbackOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                feedbackOpen
                                    ? 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20'
                                    : 'border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Feedback
                        </button>

                        {/* Feedback Panel */}
                        {feedbackOpen && (
                            <div className="absolute bottom-full right-0 mb-2 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl w-72 z-50">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-slate-900 dark:text-white">Share feedback</label>
                                    <button
                                        onClick={() => setFeedbackOpen(false)}
                                        className="h-5 w-5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                  <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Your thoughts..."
                      rows={3}
                      className="input-field text-xs w-full resize-none"
                  />
                                    <button
                                        type="submit"
                                        disabled={feedbackLoading || !feedbackText.trim()}
                                        className="btn-primary w-full text-xs py-1.5"
                                    >
                                        {feedbackLoading ? 'Sending...' : 'Send'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}