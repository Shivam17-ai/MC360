import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = ({ children, user, onLogout }) => (
  <div className="flex flex-col min-h-screen bg-white">
    <Navbar user={user} onLogout={onLogout} />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default PublicLayout;