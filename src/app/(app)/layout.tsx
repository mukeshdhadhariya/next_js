import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata={
  title:'True Feedback',
  Description:'Anonymous feedback app'
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}