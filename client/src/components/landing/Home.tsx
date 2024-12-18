import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import Phases from "./Phases/Phases";
import { Stakeholders } from "../../enum";
import { Toaster } from "../toast/Toaster";

interface HomeProps {

    user: { email: string; role: Stakeholders } | null;
}
const Home: React.FC<HomeProps> = ({ user }) => {
    return (
        <div className="App" style={{ background: 'url(../../../public/home/KirunaWhiteMap.png) no-repeat center center fixed', backgroundSize: 'cover', height: '96vh', width: '98vw', display: 'flex', flexDirection: 'column', margin: '0', borderRadius: '0.5rem' }}>
            <div style={{ marginTop: '-2rem' }}>
                <HeroSection user={user} />
            </div>
            <Phases />
            <Footer />
        </div>
    );
};




export default Home;