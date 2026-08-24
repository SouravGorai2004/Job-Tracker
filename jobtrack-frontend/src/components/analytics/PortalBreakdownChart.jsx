import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { PORTAL_LABELS, PORTAL_CHART_COLORS } from '../../utils/displayConfig'

export default function PortalBreakdownChart({ byPortal }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const data = Object.entries(byPortal || {})
        .filter(([, count]) => count > 0)
        .map(([key, count]) => ({ name: PORTAL_LABELS[key] || key, value: count, key }))

    if (data.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">No applications yet.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {data.map((entry) => <Cell key={entry.key} fill={PORTAL_CHART_COLORS[entry.key] || '#6366f1'} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{
                    backgroundColor: isDark ? '#0b0f19' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                    borderRadius: '12px', fontSize: '13px',
                }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"
                        formatter={(value) => <span style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '12px' }}>{value}</span>} />
            </PieChart>
        </ResponsiveContainer>
    )
}