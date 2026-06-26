import type { Metadata } from 'next';
import TopNav from './components/TopNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'HTML Tools',
  description: '配置型单页工具导航',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
