import RegisterSW from "./components/RegisterSW";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}