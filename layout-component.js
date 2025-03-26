import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ children, pageTitle }) => {
  return (
    <div className="bg-dark-bg text-brand-white min-h-screen flex flex-col">
      <Head>
        <title>{pageTitle} | Levi.art</title>
        <meta name="description" content="Levi.art - Professional Charcoal Artwork" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
