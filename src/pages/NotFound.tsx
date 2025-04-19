
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-lightGray">
      <div className="text-center bg-white p-12 rounded-xl shadow-lg max-w-lg animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-custom-gold">404</h1>
        <p className="text-2xl text-custom-darkBlue1 mb-8">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. Let's get you back on track.
        </p>
        <Link to="/">
          <Button className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 px-8 py-6 text-lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
