
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "@/contexts/AuthContext";

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
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  
  const handleAuthenticated = () => {
    onAuthenticated();
    onClose();
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      console.log(`AuthModal: Attempting login for ${email}`);
      await login(email, password);
      console.log('AuthModal: Login successful');
      handleAuthenticated();
    } catch (error: any) {
      console.error("AuthModal: Login error:", error);
      setError(error?.message || "Login failed. Please try again.");
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      console.log(`AuthModal: Attempting signup for ${email}`);
      await signup(name, email, password);
      console.log('AuthModal: Signup successful');
      handleAuthenticated();
    } catch (error: any) {
      console.error("AuthModal: Signup error:", error);
      setError(error?.message || "Signup failed. Please try again.");
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        {view === "login" ? (
          <LoginForm
            onLoginSubmit={handleLoginSubmit}
            onSwitchToSignup={() => setView("signup")}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <SignupForm
            onSignupSubmit={handleSignupSubmit}
            onSwitchToLogin={() => setView("login")}
            isLoading={isLoading}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
