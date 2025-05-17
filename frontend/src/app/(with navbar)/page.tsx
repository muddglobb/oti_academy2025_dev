import React from 'react'
import Hero from '@/components/landing-page/hero'
import Kenali from '@/components/landing-page/kenali'
import WhyUs from '../../components/landing-page/why-us'
import PilihanKelas from '../../components/landing-page/pilihan-kelas'
import LandingPageBackground from '@/components/landing-page-background'
import Harga from '../../components/landing-page/harga'
import Comments from '../../components/landing-page/comments'
import FAQ from '../../components/landing-page/faq'
import Mentor from '../../components/landing-page/mentor'

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