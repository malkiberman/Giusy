export default function StatCard({ label, value, accent, className, valueClassName, labelClassName }) {
  return (
    <div className={className} style={{ '--card-accent': accent }}>
      <div className={valueClassName}>{value}</div>
      <div className={labelClassName}>{label}</div>
    </div>
  );
}
