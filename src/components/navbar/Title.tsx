export const AeternusTitle = ({ children }: { children: React.ReactNode }) => (
  <h1
    className="text-5xl font-bold"
    style={{
      color: '#fff',
      background: 'linear-gradient(45deg, #2563eb -20%, #ec4899 50%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
    {children}
  </h1>
);
