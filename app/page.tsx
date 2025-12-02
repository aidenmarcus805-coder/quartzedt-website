'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Upload, Cpu, Sliders, Send } from 'lucide-react';

const features = [
  {
    title: 'AUTOSYNC™',
    desc: 'Multi-camera alignment with sub-frame accuracy.',
  },
  {
    title: 'AUTOSELECT™',
    desc: 'AI identifies vows, laughter, and key moments.',
  },
  {
    title: 'AUTOFLOW™',
    desc: 'Edits shaped around emotional rhythm.',
  },
  {
    title: 'AUDIO CLEANUP',
    desc: 'Wind, hum, and noise removed automatically.',
  },
];

const workflowSteps = [
  { num: '01', title: 'Upload', desc: 'Drop all cameras and audio files', icon: Upload },
  { num: '02', title: 'Process', desc: 'AI builds your assembly edit', icon: Cpu },
  { num: '03', title: 'Refine', desc: 'Fine-tune pacing and grade', icon: Sliders },
  { num: '04', title: 'Deliver', desc: 'Export to Premiere, Final Cut, DaVinci', icon: Send },
];

const pricing = [
  {
    name: 'STARTER',
    price: '$100',
    period: '/month',
    features: ['All AI engines', 'Premiere + Final Cut', 'Priority support'],
  },
  {
    name: 'PRO',
    price: '$250',
    period: '/month',
    features: ['Everything in Starter', 'DaVinci + CapCut Pro', 'Multi-user workspace'],
    featured: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white"
      >
        <div className="grid grid-cols-3 h-14 items-center px-8 text-[11px] tracking-[0.15em]">
          <div className="flex items-center gap-8">
            <a href="#" className="hover:opacity-50 transition-opacity">PRODUCTS</a>
            <a href="#" className="hover:opacity-50 transition-opacity">TECHNOLOGY</a>
            <a href="#" className="hover:opacity-50 transition-opacity">PRICING</a>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-[13px] tracking-[0.4em] font-medium">
              AUTOCUT
            </span>
          </div>
          <div className="flex items-center justify-end gap-8">
            <a href="#" className="hover:opacity-50 transition-opacity">LOG IN</a>
            <a href="#" className="hover:opacity-50 transition-opacity">START TRIAL</a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Full viewport height */}
      <section className="relative h-screen overflow-hidden">
        {/* Pure black base */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Red channel dots - slightly offset left */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255, 120, 120, 0.7) 0%, rgba(255, 100, 100, 0.4) 30%, transparent 50%)`,
            backgroundSize: '7px 7px',
            backgroundPosition: '-0.5px 0px',
          }}
        />
        
        {/* Green/cyan channel dots - center */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(200, 255, 255, 0.9) 0%, rgba(150, 220, 230, 0.5) 30%, transparent 50%)`,
            backgroundSize: '7px 7px',
          }}
        />
        
        {/* Blue channel dots - slightly offset right */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(130, 150, 255, 0.7) 0%, rgba(100, 130, 255, 0.4) 30%, transparent 50%)`,
            backgroundSize: '7px 7px',
            backgroundPosition: '0.5px 0px',
          }}
        />
        
        {/* Bright white LED core */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.3) 20%, transparent 40%)`,
            backgroundSize: '7px 7px',
          }}
        />
        
        {/* Soft ambient glow from right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 50% 70% at 80% 50%, rgba(180, 200, 220, 0.08) 0%, transparent 50%)',
          }}
        />

        {/* Video container - glassmorphism card */}
        <div className="absolute inset-8 top-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full rounded-2xl overflow-hidden"
          >
            {/* Gradient border - glassmorphism effect */}
            <div 
              className="absolute inset-0 rounded-2xl p-[1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
              }}
            >
              <div 
                className="w-full h-full rounded-2xl"
                style={{
                  background: 'linear-gradient(180deg, #0d0d0f 0%, #0a0a0c 50%, #080809 100%)',
                }}
              />
            </div>
        
            {/* Top edge highlight */}
            <div 
              className="absolute top-0 left-4 right-4 h-[1px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
              }}
            />
            
            {/* Left edge highlight */}
            <div 
              className="absolute top-4 bottom-4 left-0 w-[1px] pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
            />
            
            {/* Inner glow */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -20px 40px rgba(0,0,0,0.3)',
              }}
            />
        
            {/* Image content area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] rounded-lg overflow-hidden">
                {/* Replace this image with a stock image or image of Premiere Pro */}
                <img 
                  src="https://cdn.prod.website-files.com/65e5ae1fb7482afd48d22155/6706ebca1574f71e1e353ca5_6706ebc8f2ec15a497a58fb2_Tips-for-Editing-Videos-Faster-Premiere-Pro-1024x576.jpeg" 
                  alt="Premiere Pro close-up" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            {/* Gradient overlay at bottom for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </motion.div>
        </div>


        {/* Hero text - bottom right, inside the video area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-16 right-16 text-right text-white z-10"
        >
          <h1 className="text-[72px] font-light tracking-tight leading-none">
            AUTO CUT
          </h1>
          <p className="mt-4 text-[18px] font-light tracking-wide text-white/70">
            Edit Less. Create More.
          </p>
          <div className="mt-8 flex items-center justify-end gap-6 text-[11px] tracking-[0.2em]">
            <motion.a
              href="#"
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              GET EARLY ACCESS
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <a href="#" className="text-white/50 hover:text-white/90 transition-colors">
              WATCH DEMO
            </a>
          </div>
        </motion.div>
      </section>

      {/* Technology Section */}
      <section className="grid grid-cols-2 min-h-screen">
        {/* Left - Image placeholder */}
        <div className="relative bg-[#0a0a0a] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black"
          >
            {/* Placeholder for cinematic image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[70%] bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] rounded-lg shadow-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Right - Content */}
        <div className="bg-black text-white flex items-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="px-20 py-24 max-w-xl"
          >
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-6">TECHNOLOGY</p>
            <h2 className="text-[42px] font-light leading-tight tracking-tight">
              AI PRIME—A NEW<br />
              BENCHMARK<br />
              FOR FILMMAKING
            </h2>
            <p className="mt-8 text-[15px] leading-relaxed text-white/60">
              Our proprietary AI engine analyzes over 47 emotional markers per frame. 
              It understands context, anticipates narrative beats, and crafts a film 
              that feels intentionally human.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="text-[32px] font-light">47</p>
                <p className="text-[10px] tracking-[0.2em] text-white/40 mt-1">EMOTION MARKERS</p>
              </div>
              <div>
                <p className="text-[32px] font-light">4K</p>
                <p className="text-[10px] tracking-[0.2em] text-white/40 mt-1">RESOLUTION</p>
              </div>
              <div>
                <p className="text-[32px] font-light">48H</p>
                <p className="text-[10px] tracking-[0.2em] text-white/40 mt-1">DELIVERY</p>
              </div>
            </div>
            <motion.a
              href="#"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 mt-12 text-[11px] tracking-[0.2em] text-white/70 hover:text-white transition-colors border-b border-white/30 pb-1"
            >
              READ MORE
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#f5f5f5] py-32">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-[10px] tracking-[0.4em] text-black/40 mb-4">CAPABILITIES</p>
            <h2 className="text-[36px] font-light tracking-tight">Precision AI Modules</h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-px bg-black/10">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#f5f5f5] p-12 hover:bg-white transition-colors"
              >
                <p className="text-[11px] tracking-[0.3em] text-black/50 mb-3">{feature.title}</p>
                <p className="text-[18px] font-light text-black/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-white py-32">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[0.4em] text-black/40 mb-4">WORKFLOW</p>
            <h2 className="text-[36px] font-light tracking-tight">Four Steps to Cinematic</h2>
          </motion.div>

          <div className="grid grid-cols-4 gap-12">
            {workflowSteps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover="hover"
                  className="group cursor-pointer relative"
                >
                  {/* Number with icon overlay on hover */}
                  <div className="relative h-16">
                    <motion.p 
                      className="text-[48px] font-light text-black/10 absolute"
                      variants={{
                        hover: { opacity: 0, y: -10 }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.num}
                    </motion.p>
                    <motion.div
                      className="absolute top-2"
                      initial={{ opacity: 0, y: 10 }}
                      variants={{
                        hover: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  </div>
                  <motion.p 
                    className="text-[14px] tracking-[0.1em] mt-4"
                    variants={{
                      hover: { x: 4 }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.title}
                  </motion.p>
                  <p className="text-[13px] text-black/50 mt-2 leading-relaxed group-hover:text-black/70 transition-colors">
                    {step.desc}
                  </p>
                  {/* Underline animation */}
                  <motion.div 
                    className="h-px bg-black mt-6 origin-left"
                    initial={{ scaleX: 0 }}
                    variants={{
                      hover: { scaleX: 1 }
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-[#0a0a0a] text-white py-32">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-4">PRICING</p>
            <h2 className="text-[36px] font-light tracking-tight">Start Creating Today</h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            {pricing.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`p-10 ${plan.featured ? 'bg-white text-black' : 'border border-white/20'}`}
              >
                <p className="text-[10px] tracking-[0.3em] opacity-50">{plan.name}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-[48px] font-light">{plan.price}</span>
                  <span className="text-[14px] opacity-50 ml-2">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-[13px] opacity-70">— {feature}</li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-10 w-full py-4 text-[11px] tracking-[0.2em] transition-colors ${
                    plan.featured
                      ? 'bg-black text-white hover:bg-black/80'
                      : 'border border-white/30 hover:bg-white hover:text-black'
                  }`}
                >
                  GET STARTED
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-[12px] text-white/40"
          >
            7-day free trial included. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[42px] font-light tracking-tight leading-tight">
              Ready to transform<br />your workflow?
            </h2>
            <p className="mt-6 text-[15px] text-black/50">
              Join hundreds of wedding filmmakers who edit less and create more.
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block mt-10 px-12 py-4 bg-black text-white text-[11px] tracking-[0.2em] hover:bg-black/80 transition-colors"
            >
              START FREE TRIAL
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f5] py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] tracking-[0.3em]">AUTOCUT</p>
              <p className="text-[11px] text-black/40 mt-2">AI Video Editing for Wedding Filmmakers</p>
            </div>
            <div className="flex items-center gap-12 text-[11px] tracking-[0.15em] text-black/50">
              <a href="#" className="hover:text-black transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-black transition-colors">TERMS</a>
              <a href="#" className="hover:text-black transition-colors">CONTACT</a>
              <a href="#" className="hover:text-black transition-colors">TWITTER</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-black/10 text-[10px] text-black/30">
            © 2024 AutoCut. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
