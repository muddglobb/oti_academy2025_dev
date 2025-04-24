import React from 'react'
import Hero from '@/app/modules/landing-page/hero'
import Kenali from '@/app/modules/landing-page/kenali'
import WhyUs from './modules/landing-page/why-us'
import PilihanKelas from './modules/landing-page/pilihan-kelas'

const page = () => {
  return (
    <div className='bg-background min-h-screen'>
      <Hero />
      <Kenali />
      <WhyUs />
      <PilihanKelas />
    </div>
  )
}

export default page