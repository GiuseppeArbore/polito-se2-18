import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import Phases from "./Phases/Phases";
import { Stakeholders } from "../../enum";
import { Toaster } from "../toast/Toaster";

function Home() {
    return (
        <div className="App" style={{ background: 'url(../../../public/home/KirunaWhiteMap.png) no-repeat center center fixed', backgroundSize: 'cover', height: '96vh', width: '98vw', display: 'flex', flexDirection: 'column', margin: '0', borderRadius: '0.5rem' }}>
            <div style={{ marginTop: '-2rem' }}>
                <HeroSection/>
            </div>
            <Phases />
            <Footer />
        </div>
    );
};




export default Home;