import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with sticky navigation */}
      <Header />
      
      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
