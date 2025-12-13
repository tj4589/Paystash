import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';

import Features from '../components/Features';
import CTA from '../components/CTA';

const Home = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Features />
                <CTA />
            </main>
        </>
    );
};

export default Home;
