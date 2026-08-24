import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

export default function OverTimeChart({ data }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'
    const textColor = isDark ? '#94a3b8' : '#64748b'

    if (!data || data.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">Not enough data yet to show a trend.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{
                    backgroundColor: isDark ? '#0b0f19' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                    borderRadius: '12px', fontSize: '13px',
                }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}