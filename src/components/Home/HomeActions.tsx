
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HomeActionsProps {
  onSignUp: () => void;
  onLogin: () => void;
}

const HomeActions: React.FC<HomeActionsProps> = ({ onSignUp, onLogin }) => (
  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
    <Button
      className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 px-8 py-6 text-lg font-semibold shadow-lg animate-scale-in"
      onClick={onSignUp}
    >
      Sign Up Free
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      className="border-custom-darkBlue1 text-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white px-8 py-6 text-lg font-semibold animate-scale-in"
      style={{ animationDelay: "0.85s" }}
      onClick={onLogin}
    >
      Log In
    </Button>
  </div>
);

export default HomeActions;
