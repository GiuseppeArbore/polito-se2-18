import React, { useState } from "react";
import { Button, Dialog, DialogPanel, Select, SelectItem, Text, TextInput } from "@tremor/react";
import { Link } from "react-router-dom";
import { Badge } from "@tremor/react";


const HeroSection: React.FC = () => {

  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState(false);
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
          <Badge color="white" size="lg" className="cursor-pointer ">
            Start Exploring
          </Badge>
        </Link>
      </div>
      <Button onClick={() => setShowLogin(true)}>Login</Button>
      <Dialog open={showLogin} onClose={(val) => setShowLogin(val)} static={true}>
        <DialogPanel>
          <h2 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Login</h2>
          <div className="mx-auto max-w-sm space-y-8 mt-2">
            <div>
              <TextInput placeholder="Type your username here" error={error} errorMessage="Wrong username" />
            </div>
            <div>
              <TextInput placeholder="Type password here" type="password" />
            </div>
            <div className="mb-4 text-center font-mono text-sm text-slate-500">
              Select your role
            </div>
            <Select defaultValue="1">
              <SelectItem value="1">Urban Planner</SelectItem>
              <SelectItem value="2">Resident</SelectItem>
              <SelectItem value="3">Visitor</SelectItem>  // I don't know if we really need this
            </Select>
          </div>

          <div className="mt-8 flex items-center justify-end space-x-2">
            <Button size="xs" variant="secondary" onClick={() => setShowLogin(false)}>
              Cancel
            </Button>
            <Button size="xs" variant="primary" onClick={() => setShowLogin(false)}>
              Login
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </section>
  );
};

export default HeroSection;
