import React, { useState } from "react";
import { Button, Dialog, DialogPanel, Select, SelectItem, Text, TextInput } from "@tremor/react";
import { Link } from "react-router-dom";
import { Badge } from "@tremor/react";

interface HeroSectionProps {
  login: (credentials: { username: string; password: string }) => void;
  loginErrorMessage: { msg: string; type: string }; 
  error : boolean | undefined;
  user : { id: string; name: string } | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ login, loginErrorMessage, error, user}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login({ username, password });
  };

  const handleClose = () => {
    setShowLogin(false);
    setUsername('');
    setPassword('');
  };

  return (
    <section className="hero-section bg-[#003d8e] text-white h-[40vh] flex flex-col justify-center items-center p-4 rounded-tl-lg rounded-tr-lg">
      <h1 className="text-4xl font-bold animate__animated animate__fadeIn animate__delay-1s text-white">
        Kiruna Explorer: A City on the Move
      </h1>
      <Text className="text-xl mt-4 animate__animated animate__fadeIn animate__delay-2s pb-8">
        Discover the journey of Sweden's moving city
      </Text>
      <div className="animate__animated animate__fadeIn animate__delay-2s mb-4 custom-blink">
        <Link to="/dashboard">
          <Badge color="white" size="lg" className="cursor-pointer">
            Start Exploring
          </Badge>
        </Link>
      </div>
       {/* hide if logged in */}
      <Button className="login" onClick={() => setShowLogin(true)}>Login</Button>
      <Dialog open={showLogin} onClose={handleClose} static={true}>
        <DialogPanel>
          <h2 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Login</h2>
          <div className="mx-auto max-w-sm space-y-8 mt-2">
            <div>
              <TextInput
                placeholder="Type your username here"
                value={username}
                error={error}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <TextInput
                placeholder="Type password here"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                errorMessage={loginErrorMessage.msg}
              />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-end space-x-2">
            <Button size="xs" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="xs" variant="primary" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </section>
  );
};

export default HeroSection;
