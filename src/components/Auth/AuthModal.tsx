
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

  const handleAuthenticated = () => {
    onAuthenticated();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
        {view === "login" ? (
          <LoginForm
            onLogin={handleAuthenticated}
            onSwitchToSignup={() => setView("signup")}
          />
        ) : (
          <SignupForm
            onSignup={handleAuthenticated}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
