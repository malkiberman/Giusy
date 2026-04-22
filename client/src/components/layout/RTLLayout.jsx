export default function RTLLayout({ children, className }) {
  return (
    <div dir="rtl" className={className}>
      {children}
    </div>
  );
}
