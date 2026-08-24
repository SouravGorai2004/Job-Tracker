import { STATUS_CONFIG } from '../../utils/displayConfig'

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status]
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${config.color}`}>
      {config.label}
    </span>
    )
}