import React, { useState } from "react";
import { Button, Dialog, DialogPanel, Select, SelectItem, Text, TextInput } from "@tremor/react";
import { Link, redirect } from "react-router-dom";
import { Badge } from "@tremor/react";
import { Stakeholders } from "../../enum"
import "../../css/herosection.css"





function HeroSection() {
    return (
        <section className="hero-section">
            <div className="hero-section-content">
                <div className="hero-section-content">
                    <p className="hero-section-title">
                        Kiruna Explorer: A City on the Move
                    </p>
                    <p className="hero-section-text">
                        Discover the journey of Sweden's moving city
                    </p>
                </div>
                <div className="hero-section-link-container">
                    <Link to="/dashboard">
                        <Badge color="white" size="lg" className="hero-section-badge">
                            Start Exploring
                        </Badge>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
