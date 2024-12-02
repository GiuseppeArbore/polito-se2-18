import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";

interface HomeProps {
  login: (credentials: { username: string; password: string }) => void;
  loginErrorMessage: { msg: string; type: string };
  error : boolean|undefined;
  user : { id: string; name: string } | null;
}
const Home: React.FC<HomeProps> = ({ login, loginErrorMessage, error, user }) => {
  return (
    <div className="App">
      <HeroSection login={login} loginErrorMessage={loginErrorMessage} error={error} user={user} />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Home;