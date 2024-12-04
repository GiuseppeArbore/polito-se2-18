import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import { Stakeholders } from "../../enum";
import { Toaster } from "../toast/Toaster";

interface HomeProps {
  login: (credentials: { username: string; password: string }) => void;
  logout: () => void;
  setError: React.Dispatch<React.SetStateAction<boolean|undefined>>;
  loginErrorMessage: { msg: string; type: string };
  error : boolean|undefined;
  user: { email: string; role: Stakeholders } | null;
}
const Home: React.FC<HomeProps> = ({ login, logout, setError, loginErrorMessage, error, user }) => {
  return (
    <div className="App">
      <HeroSection login={login} logout= {logout} setError = {setError} loginErrorMessage={loginErrorMessage} error={error} user={user} />
      <FeaturesSection />
      <Footer />
      <Toaster/>
    </div>
  );
};

export default Home;