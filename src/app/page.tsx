
'use client'
import * as React from "react"
 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel"
import messages from '@/messages.json'
import { Mail } from "lucide-react"

const page = () => {
  return (
    <>
    <main className='flex-grow flex flex-col justify-center items-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Converse with anyone annonymously </h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where Identity remain a Mystery</p>
      </section>
        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

   
     
  
   
 </>
  )
}

export default page