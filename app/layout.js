import './globals.css';

export const metadata = {
  title: 'Note Taking App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
