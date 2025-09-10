"use client";

import Link from 'next/link';
import { useState } from 'react';

async function startCheckout(product: "DIY"|"FULL"|"ADDON") {
  const res = await fetch("/api/checkout", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ product }) 
  });
  
  const data = await res.json();
  if (data?.url) window.location.href = data.url;
  else alert(data?.error || "Checkout not available yet.");
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('individuals');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-800">Quant by Boji</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
          </div>
          <div>
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Quantitative Tools</span> for Modern Investors
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Professional-grade analytics, portfolio optimization, and risk management tools that were once exclusive to Wall Street, now available to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => startCheckout("DIY")} 
                className="btn btn-primary">
                Start Free Trial
              </button>
              <Link href="/#features" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our quantitative tools help you make data-driven investment decisions.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Access sophisticated analytics tools with intuitive visualizations and in-depth performance metrics.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-gray-600">Monitor and optimize your portfolio risk with professional-grade measurement tools.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Strategies</h3>
              <p className="text-gray-600">Create, backtest, and deploy custom investment strategies based on quantitative analysis.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your investment needs.</p>
            
            {/* Tab Selection */}
            <div className="inline-flex bg-white rounded-lg p-1 shadow-md mt-8">
              <button
                onClick={() => setActiveTab('individuals')}
                className={`px-6 py-2 rounded-md ${activeTab === 'individuals' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                For Individuals
              </button>
              <button
                onClick={() => setActiveTab('institutions')}
                className={`px-6 py-2 rounded-md ${activeTab === 'institutions' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                For Institutions
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* DIY Plan */}
            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-2">DIY Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-gray-600 ml-2">/ month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for individual investors who want essential quantitative tools.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Portfolio analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic risk metrics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 10 portfolios
                </li>
              </ul>
              <button 
                onClick={() => startCheckout("DIY")} 
                className="btn btn-primary w-full">
                Get Started
              </button>
            </div>
            
            {/* Full Plan - Featured */}
            <div className="card p-8 transform md:scale-105 card-highlight">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium text-sm">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$129</span>
                <span className="text-gray-600 ml-2">/ month</span>
              </div>
              <p className="text-gray-600 mb-6">Comprehensive solution for active investors and traders.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All DIY features
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced strategy backtesting
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Real-time risk alerts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited portfolios
                </li>
              </ul>
              <button 
                onClick={() => startCheckout("FULL")} 
                className="btn btn-primary w-full">
                Get Started
              </button>
            </div>
            
            {/* Add-on Plan */}
            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-2">Add-on Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-600 ml-2">/ month</span>
              </div>
              <p className="text-gray-600 mb-6">Additional features for existing DIY package customers.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  API access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Custom reporting
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Priority support
                </li>
              </ul>
              <button 
                onClick={() => startCheckout("ADDON")} 
                className="btn btn-primary w-full">
                Add Features
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied investors who trust our quantitative tools.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JP</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Peterson</h4>
                  <p className="text-gray-500 text-sm">Individual Investor</p>
                </div>
              </div>
              <p className="text-gray-600">"The risk management tools helped me navigate the market volatility with confidence. A must-have for serious investors."</p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">AR</span>
                </div>
                <div>
                  <h4 className="font-semibold">Amanda Rodriguez</h4>
                  <p className="text-gray-500 text-sm">Portfolio Manager</p>
                </div>
              </div>
              <p className="text-gray-600">"Quant by Boji provides institutional-grade analytics at a fraction of the cost of traditional solutions. It's revolutionized our approach."</p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">MT</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Thompson</h4>
                  <p className="text-gray-500 text-sm">Day Trader</p>
                </div>
              </div>
              <p className="text-gray-600">"The backtesting capabilities have allowed me to refine my strategies with confidence before risking capital. Worth every penny."</p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your investment approach?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of investors who are using data-driven decisions to improve their results.</p>
          <button 
            onClick={() => startCheckout("FULL")} 
            className="btn bg-white text-blue-600 hover:bg-gray-100">
            Start Your 14-Day Free Trial
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-6 h-6 rounded"></div>
                </div>
                <span className="font-bold text-xl">Quant by Boji</span>
              </div>
              <p className="text-gray-400">Professional-grade quantitative tools for modern investors.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/#pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white">API</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Quant by Boji. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
