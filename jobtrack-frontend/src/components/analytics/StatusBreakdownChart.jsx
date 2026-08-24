import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { STATUS_CONFIG, STATUS_CHART_COLORS } from '../../utils/displayConfig'

const STATUS_ORDER = ['SAVED', 'APPLIED', 'ASSESSMENT', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']

export default function StatusBreakdownChart({ byStatus }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'
    const textColor = isDark ? '#94a3b8' : '#64748b'

    const data = STATUS_ORDER
        .filter((key) => byStatus?.[key])
        .map((key) => ({ status: STATUS_CONFIG[key].label, count: byStatus[key], key }))

    if (data.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">No applications yet.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="status" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{
                    backgroundColor: isDark ? '#0b0f19' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                    borderRadius: '12px', fontSize: '13px',
                }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {data.map((entry) => <Cell key={entry.key} fill={STATUS_CHART_COLORS[entry.key]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}