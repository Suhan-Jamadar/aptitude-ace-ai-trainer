import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes
  const location = useLocation();

  const handleLogout = () => {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full w-10 h-10 bg-custom-gold text-custom-darkBlue1 p-0" variant="outline">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
