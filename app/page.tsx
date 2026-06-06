
'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import SearchBar from "@/component/SearchBar";
import { Reel, ReelItem } from '@/components/ui/reel';
import { OrbButton } from '@/components/ui/orb-button';
import ExamSection from "@/components/home/ExamSection";
// High-quality global university campus imagery for the slider reel
const collegeReelItems: ReelItem[] = [
  {
    id: 'college-0',
    type: 'image',
    src: 'https://w0.peakpx.com/wallpaper/752/459/HD-wallpaper-welcome-iit-delhi-iit-delhi.jpg',
  },
  {
    id: 'college-1',
    type: 'image',
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/IIIT_Dharwad.jpg',
  },
  {
    id: 'college-2',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'college-3',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1599634874901-e919c4fe1400?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWl0JTIwcm9vcmtlZXxlbnwwfHwwfHx8MA%3D%3Dhttps://unsplash.com/s/photos/iit-roorkee',
  },
  {
    id: 'college-4',
    type: 'image',
    src: 'https://techportal.in/wp-content/uploads/2023/11/iit-bombay-768x318.jpg',
  },
  {
    id: 'college-5',
    type: 'image',
    src: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg',
  },
];



export default function HomePage() {
  return (
    // Premium warm-ivory backdrop with smooth subtle grid dots
    <div className='min-h-screen w-full bg-[#FDFBF7] text-stone-900 flex flex-col overflow-hidden antialiased bg-[radial-gradient(#F3EDE0_1px,transparent_1px)] [background-size:24px_24px]'>
      

      <main className='flex-1 flex flex-col items-center pt-16 pb-20 text-center px-4 max-w-5xl mx-auto w-full z-0'>
        
 {/* Hero Heading */}

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="text-center"
>
  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-950">
    College
    <span className="block text-[#B4975A]">
      Discovery
    </span>
  </h1>
</motion.div>

{/* Search Bar */}

<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.3 }}
  className="mt-10 w-full max-w-2xl"
>
  <div className="p-2 bg-white/90 border border-stone-200 rounded-2xl shadow-lg backdrop-blur-md">
    <SearchBar />
  </div>
</motion.div>

{/* Subtitle */}

<motion.p
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.5 }}
  className="mt-8 max-w-3xl text-center text-stone-600 text-lg md:text-xl leading-relaxed"
>
  
</motion.p>



    

        {/* Main Heading — Styled with a luxury editorial combination */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className='text-2xl md:text-6xl font-sans font-normal tracking-tight text-stone-950 max-w-3xl leading-[1.15]'
        >
          Find the campus where you will{' '}
          <em className='font-serif font-normal italic text-[#B4975A] block md:inline'>
            truly grow
          </em>
        </motion.h1>

        {/* Descriptive Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className='mt-5 text-sm md:text-base text-stone-500 max-w-xl leading-relaxed font-sans'
        >
          Discover programs, track admission cutoffs, inspect detailed fee structures, 
          and explore placements across top institutions seamlessly.
        </motion.p>

      

        {/* Dynamic Interactive College Reel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className='mt-16 w-full opacity-95 hover:opacity-100 transition-opacity'
        >
          <div className="rounded-2xl overflow-hidden border border-stone-200/40 shadow-sm bg-white/30 p-2 backdrop-blur-sm">
            <Reel
              items={collegeReelItems}
              rows={2}
              pauseOnHover={true}
              direction='alternate'
            />
          </div>
        </motion.div>

      </main>
      <ExamSection />
    </div>
  );
}