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
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
              <path d="M4 4 L18 4 L18 7 L12 14 L18 21 L18 24 L4 24 L4 21 L12 21 L8 17 L12 13 L4 13 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
              <path d="M21 12 C20 11 19 12 19 14 C19 16 20 17 21 16 C22 15 23 16 23 14 C23 12 22 11 21 12 Z M21 16 C22 17 23 16 23 14 C23 12 22 11 21 12 C20 13 21 16 21 16 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
            </svg>
            <span className="font-bold text-xl text-white">QuantByBoji</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/#features" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">How It Works</Link>
            <Link href="/#pricing" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Pricing</Link>
            <Link href="/#about" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">About</Link>
          </div>
          <div>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Automate TradingView alerts into real Tradovate orders</span>
            </h1>
            <p className="text-lg text-blue-400 font-semibold mb-4">
              Reliable, Low-Latency Execution — No Black-Boxes, Just Code You Own
            </p>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
             End-to-End Trading Pipeline: TradingView ➜ AWS ➜ Tradovate ➜ Telegram/X
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => startCheckout("DIY")} 
                className="btn btn-primary">
                Buy DIY ($500)
              </button>
              <Link href="/#features" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">How It Works</h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
                  <path d="M15 13l2-2 2 2v4h-4v-4z" fill="#2196F3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">TradingView Alert</h3>
              <p className="text-gray-300">Your strategy triggers an alert in TradingView with your custom webhook URL</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 12L9 7h6l2.5 5L15 17H9l-2.5-5z" fill="#FF9900"/>
                  <path d="M12 4l8 4v8l-8 4-8-4V8l8-4zm0 2L6 9v6l6 3 6-3V9l-6-3z" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AWS Processing</h3>
              <p className="text-gray-300">Alert hits your AWS Lambda function for validation and processing</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#4CAF50"/>
                  <path d="M8 12l2 2 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Tradovate Execution</h3>
              <p className="text-gray-300">Validated order gets executed instantly on your Tradovate account</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0088CC"/>
                  <path d="M8 12l2 2 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8l4 4-4 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Confirmation</h3>
              <p className="text-gray-300">Order confirmation sent to your Telegram and/or X (Twitter) account</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
                  <path d="M7 14l3-3 2 2 4-4" stroke="#9C27B0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="14" r="1" fill="#9C27B0"/>
                  <circle cx="10" cy="11" r="1" fill="#9C27B0"/>
                  <circle cx="12" cy="13" r="1" fill="#9C27B0"/>
                  <circle cx="16" cy="9" r="1" fill="#9C27B0"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Monitor & Scale</h3>
              <p className="text-gray-300">Track performance and scale your automated trading strategies</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-black" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Pricing Packages</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Pick the package that matches how hands-on you want to be. Quick deployment, solid code, full transparency.</p>
            <p className="text-sm text-blue-400 mt-2">Launch in ~1-2 days once alert code is ready</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* DIY Plan */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2 text-white">DIY Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-5xl font-bold text-white">$500</span>
                <span className="text-gray-400 ml-2 text-lg">one-time</span>
              </div>
              <p className="text-gray-300 mb-6">You get the full code and documentation to deploy the pipeline yourself.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  TradingView alert JSON templates
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AWS API Gateway + Lambda (Python) code
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Tradovate REST API examples
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Step-by-step README
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Support: no live sessions included
                </li>
              </ul>
              <button 
                onClick={() => startCheckout("DIY")} 
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg">
                Get DIY Package - $500
              </button>
            </div>
            
            {/* Full Plan - Featured */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-blue-500 rounded-xl p-8 transform md:scale-105 relative shadow-2xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                🔥 MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white mt-4">Full Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-5xl font-bold text-white">$900</span>
                <span className="text-blue-200 ml-2 text-lg">one-time</span>
              </div>
              <p className="text-gray-300 mb-6">Everything in DIY plus hands-on help to get you live fast.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All DIY deliverables (code + README)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  2 live setup sessions (screen-share)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Deploy and validate your pipeline
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 week troubleshooting after go-live
                </li>
              </ul>
              <button 
                onClick={() => startCheckout("FULL")} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                Get Full Package - $900
              </button>
            </div>
            
            {/* Add-on Plan */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2 text-white">Add-on Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-5xl font-bold text-white">$200</span>
                <span className="text-gray-400 ml-2 text-lg">optional</span>
              </div>
              <p className="text-gray-300 mb-6">An extra 60-minute live session or one small customization. Only available with DIY or Full Package.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Extra 60-minute live session
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  OR one small customization
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Payload tweaks, new alert fields
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Retest on new symbols
                </li>
              </ul>
              <button 
                onClick={() => startCheckout("ADDON")} 
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg">
                Get Add-on Package - $200
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust & Social Proof */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Trusted by Professional Traders</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Real feedback from traders using our automation pipeline.</p>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mb-16 flex-wrap">
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">&lt; 200ms Latency</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Enterprise Security</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">MK</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Michael K.</h4>
                  <p className="text-blue-400 text-sm">Futures Trader, 8 years</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-4">"Finally, a solution that doesn't hide my trading logic in a black box. The AWS setup is rock solid and I can see exactly what's happening with every trade."</p>
              <div className="flex items-center justify-between">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="text-green-400 font-semibold">✓ Verified Purchase</span>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">SL</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Sarah L.</h4>
                  <p className="text-blue-400 text-sm">Algorithmic Trader</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-4">"The setup was straightforward and now my TradingView alerts execute flawlessly on Tradovate. The Telegram notifications give me perfect peace of mind."</p>
              <div className="flex items-center justify-between">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="text-green-400 font-semibold">✓ Verified Purchase</span>
              </div>
            </div>
          </div>
          
          {/* Who This Is For */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-8 text-white">Is This You?</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">TradingView Users</h4>
              <p className="text-gray-300 text-sm">Already using TradingView alerts and want reliable automation</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Self-Hosters</h4>
              <p className="text-gray-300 text-sm">Want full control over your trading logic and credentials</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">No Black-Boxes</h4>
              <p className="text-gray-300 text-sm">Prefer transparency over renting third-party solutions</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to automate your TradingView alerts?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Get the complete pipeline to turn your alerts into live trades with full control and transparency.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => startCheckout("DIY")} 
              className="btn bg-white text-blue-600 hover:bg-gray-100">
              Buy DIY ($500)
            </button>
            <button 
              onClick={() => startCheckout("FULL")} 
              className="btn bg-white text-blue-600 hover:bg-gray-100">
              Buy Full Package ($900)
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-black text-white border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-6 h-6 rounded"></div>
                </div>
                <span className="font-bold text-xl">Quant by Boji</span>
              </div>
              <p className="text-gray-400">Professional TradingView automation for serious traders.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-gray-400 hover:text-blue-400 transition-colors">How It Works</Link></li>
                <li><Link href="/#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/#about" className="text-gray-400 hover:text-blue-400 transition-colors">About</Link></li>
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
