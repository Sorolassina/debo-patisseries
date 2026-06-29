export function TextureOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03]"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/p6.png')",
      }}
      aria-hidden
    />
  );
}
