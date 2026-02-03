import { ReactNode } from 'react';
// import Navbar from './Navbar';
// import Footer from './Footer';
import Navbar from '../landing-page/Navbar';
import Footer from '../landing-page/Footer';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const Layout = ({ children, showNavbar = true, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}
      <main className={`flex-1 bg-white ${showNavbar ? 'pt-16 lg:pt-20' : 'pt-8 lg:pt-12'}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
