
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    // This would be replaced with actual authentication logic
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // This would be replaced with actual logout logic
    setIsLoggedIn(false);
  };

  return (
    <header className="w-full py-4 px-6 bg-custom-darkBlue1 text-white shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
          <span className="text-custom-gold group-hover:scale-110 transition-transform duration-300">
            Aptitude
          </span>
          <span className="text-custom-gold group-hover:scale-110 transition-transform duration-300 delay-75">
            Ace
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className={`${
              location.pathname === '/' 
                ? 'text-custom-gold' 
                : 'text-white hover:text-custom-gold'
            } transition-colors duration-300`}
          >
            Home
          </Link>
          <Link 
            to="/aptitude" 
            className={`${
              location.pathname === '/aptitude' 
                ? 'text-custom-gold' 
                : 'text-white hover:text-custom-gold'
            } transition-colors duration-300`}
          >
            Aptitude Training
          </Link>
          <Link 
            to="/flashcards" 
            className={`${
              location.pathname === '/flashcards' 
                ? 'text-custom-gold' 
                : 'text-white hover:text-custom-gold'
            } transition-colors duration-300`}
          >
            Flashcards
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Button className="rounded-full w-10 h-10 bg-custom-gold text-custom-darkBlue1 p-0" variant="outline">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-custom-gold"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                className="text-white hover:text-custom-gold"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button 
                className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
