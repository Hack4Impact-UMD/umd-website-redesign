interface ContentNoticeProps {
  children: React.ReactNode;
}

export default function ContentNotice({ children }: ContentNoticeProps) {
  return (
    <p role="status" className="rounded-lg border border-state-warning/30 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {children}
    </p>
  );
}
