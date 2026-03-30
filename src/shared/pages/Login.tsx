import { useNavigate } from "react-router-dom";
import { useStellar } from "../../contexts/StellarContext";
import { Button } from "../components/Common";

export const Login = () => {
  const { connect, publicKey, userRole } = useStellar();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const address = await connect();
    if (address) {
      // Logic for where to send them is handled by the RoleGuard, 
      // but we can help it along here:
      if (userRole === 0) navigate('/donor/dashboard');
      else if (userRole === 1) navigate('/manager/dashboard');
      else navigate('/register');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to HIWOT</h1>
      <Button onClick={handleLogin} size="lg">
        Connect Freighter Wallet
      </Button>
    </div>
  );
};