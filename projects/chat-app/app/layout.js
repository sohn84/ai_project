import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'AI Chat App',
  description: 'AI powered chat application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://cdn.openai.com/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
