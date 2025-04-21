
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  defaultView?: "login" | "signup";
}

const AuthModal = ({
  isOpen,
  onClose,
  onAuthenticated,
  defaultView = "login"
}: AuthModalProps) => {
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAuthenticated = () => {
    onAuthenticated();
    onClose();
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is where you'll connect to your MongoDB backend
      // Example: await authService.login(email, password);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      handleAuthenticated();
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is where you'll connect to your MongoDB backend
      // Example: await authService.signup(name, email, password);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      handleAuthenticated();
    } catch (error) {
      console.error("Signup error:", error);
      // Handle signup error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
        {view === "login" ? (
          <LoginForm
            onLoginSubmit={handleLoginSubmit}
            onSwitchToSignup={() => setView("signup")}
            isLoading={isLoading}
          />
        ) : (
          <SignupForm
            onSignupSubmit={handleSignupSubmit}
            onSwitchToLogin={() => setView("login")}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
