import React from 'react'
import Hero from '@/app/modules/landing-page/hero'
import Kenali from '@/app/modules/landing-page/kenali'
import WhyUs from './modules/landing-page/why-us'
import PilihanKelas from './modules/landing-page/pilihan-kelas'
import LandingPageBackground from '@/components/landing-page-background'
import Harga from './modules/landing-page/harga'
import Comments from './modules/landing-page/comments'
import FAQ from './modules/landing-page/faq'
import Mentor from './modules/landing-page/mentor'

const page = () => {
  return (
    <div className='overflow-x-hidden relative'>
      <div className='min-h-screen'>
        <Hero />
        <Kenali />
        <WhyUs />
        <PilihanKelas />
        <Mentor />
        <Harga />
        <Comments />
        <FAQ />
      </div>
      <div>
        <LandingPageBackground />
      </div>
    </div>
  )
}

export default page