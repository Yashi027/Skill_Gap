const STATUS_STYLES = {
    verified: {
        label: '✅ Verified', className: 'bg-green-100 text-green-700'
    },
    'weak-evidence': {
        label: '⚠️ Weak evidence', className: 'bg-yellow-100 text-yellow-700'
    },
    unverified: {
        label: '🚩 Unverified', className: 'bg-red-100 text-red-700'
    }
}

const SkillVerification = ({ verification }) => {
    if (!verification)
        return null;
    const style = STATUS_STYLES[verification.status] || STATUS_STYLES['verified'];
    return (
        <span
            title={verification.reason}
            className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${style.className}`}
        >
            {style.label}
        </span>
    );
}

export default SkillVerification;
