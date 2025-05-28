import Container from '@/components/container'
import HelpFAQ from '@/components/help-center/help-faq'
import Contact from '@/components/help-center/contact'
import React from 'react'

const HelpPage = () => {
  return (
    <Container className='gap-0 px-2 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 md:py-6 lg:py-8'>
      <p className="text-[12px] lg:text-[14px] pb-1">Help Contact</p>
      <div className="flex flex-col sm:flex-row-reverse gap-6">
        <div className="sm:w-[350px] flex-shrink-0">
          <Contact/>
        </div>
        <div className="flex-1">
          <HelpFAQ/>
        </div>
      </div>
    </Container>
  )
}

export default HelpPage