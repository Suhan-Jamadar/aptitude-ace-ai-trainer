
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

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
  const { login, signup } = useAuth();
  
  const handleAuthenticated = () => {
    onAuthenticated();
    onClose();
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the login method from AuthContext (which will use authService)
      await login(email, password);
      toast.success("Successfully logged in!");
      handleAuthenticated();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the signup method from AuthContext (which will use authService)
      await signup(name, email, password);
      toast.success("Account created successfully!");
      handleAuthenticated();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again later.");
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
