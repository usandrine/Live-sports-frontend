// Re-mounts on every navigation, giving each page a quick fade/slide entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}
