import React from 'react'
import Hero from '@/app/modules/landing-page/hero'
import Kenali from '@/app/modules/landing-page/kenali'
import WhyUs from './modules/landing-page/why-us'
import PilihanKelas from './modules/landing-page/pilihan-kelas'
import LandingPageBackground from '@/components/landing-page-background'
import Harga from './modules/landing-page/harga'

const page = () => {
  return (
    <div className='bg-neutral-900 overflow-x-hidden relative'>
      <div className='min-h-screen relative z-5'>
        <Hero />
        <Kenali />
        <WhyUs />
        <PilihanKelas />
        <Harga />
      </div>
      <div>
        <LandingPageBackground />
      </div>
    </div>
  )
}

export default page