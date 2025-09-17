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
              <span className="gradient-text">QuantByBoji</span> Automate TradingView alerts into real Tradovate orders
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
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
      
      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">5 simple steps to automate your TradingView alerts into live trades.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">TradingView Alerts</h3>
              <p className="text-gray-600 text-sm">Create/enable alerts in TradingView using PineScript or strategy alert_message.</p>
            </div>
            
            {/* Step 2 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AWS Webhook</h3>
              <p className="text-gray-600 text-sm">Alerts POST to your secure AWS API Gateway webhook endpoint.</p>
            </div>
            
            {/* Step 3 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lambda Processing</h3>
              <p className="text-gray-600 text-sm">AWS Lambda (Python) parses the payload and calls the Tradovate REST API.</p>
            </div>
            
            {/* Step 4 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tradovate Orders</h3>
              <p className="text-gray-600 text-sm">Tradovate places/updates orders (live or SIM).</p>
            </div>
            
            {/* Step 5 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">5</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Telegram Alerts</h3>
              <p className="text-gray-600 text-sm">Telegram sends you a confirmation message.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the package that fits your automation needs.</p>
            
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* DIY Plan */}
            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-2">DIY Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$500</span>
                <span className="text-gray-600 ml-2">one-time</span>
              </div>
              <p className="text-gray-600 mb-6">You get the full code and documentation to deploy the pipeline yourself.</p>
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
                className="btn btn-primary w-full">
                Buy DIY ($500)
              </button>
            </div>
            
            {/* Full Plan - Featured */}
            <div className="card p-8 transform md:scale-105 card-highlight">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium text-sm">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$900</span>
                <span className="text-gray-600 ml-2">one-time</span>
              </div>
              <p className="text-gray-600 mb-6">Everything in DIY plus hands-on help to get you live fast.</p>
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
                className="btn btn-primary w-full">
                Buy Full Package ($900)
              </button>
            </div>
            
            {/* Add-on Plan */}
            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-2">Add-on Package</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$200</span>
                <span className="text-gray-600 ml-2">optional</span>
              </div>
              <p className="text-gray-600 mb-6">An extra 60-minute live session or one small customization. Only available with DIY or Full Package.</p>
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
                className="btn btn-primary w-full">
                Add-on ($200)
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Who This Is For</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">This automation pipeline is designed for specific types of traders.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JP</span>
                </div>
                <div>
                  <h4 className="font-semibold">TradingView Users</h4>
                  <p className="text-gray-500 text-sm">Existing Alert Systems</p>
                </div>
              </div>
              <p className="text-gray-600">"Traders who already have indicators/alerts in TradingView and want reliable automation without black-box solutions."</p>
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
                  <h4 className="font-semibold">Self-Hosters</h4>
                  <p className="text-gray-500 text-sm">Technical Control</p>
                </div>
              </div>
              <p className="text-gray-600">"People who want to self-host and understand their automation, not rent a black box from third parties."</p>
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
                  <h4 className="font-semibold">End-to-End Setup</h4>
                  <p className="text-gray-500 text-sm">Complete Control</p>
                </div>
              </div>
              <p className="text-gray-600">"Anyone who needs a real, reproducible, end-to-end setup with full control over logic and broker credentials."</p>
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
              <p className="text-gray-400">Automate TradingView alerts into real Tradovate orders.</p>
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
