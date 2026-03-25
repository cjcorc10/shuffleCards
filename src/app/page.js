'use client'
import styles from './page.module.scss'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {

  const scrollRef = useRef(null)
  const counterRef = useRef(null)
  const imagesRef = useRef([])
  const imageContainer = useRef(null)
  const done = useRef(false);
  const addToRefs = (e) => {
    if(e && !imagesRef.current.includes(e)) imagesRef.current.push(e)
  }

  const setImages = (images) => {
    const numImages = images.length
    gsap.to(images, {
      translateY: (i) => `${i*-30}%`,
      translateZ: (i) => (i ? `${(i-1)*-10}px` : `${numImages*-10}px`),
    })
  }

  useGSAP(() => {
    if(!scrollRef) return
    const images = imagesRef.current
    const numImages = images.length
    if(!numImages) return

   
      const scroll = ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "+=1600px",
        pin: true,
        scrub: 1,
        markers: true,
        // onEnter: () => setImages(images),  
        onUpdate: (self) => {
          const {progress} = self;
          const steps = images.length - 1
          const segmentLength = 1 / steps

      
          images.forEach((img, i) => {
            const currentCard = img;
            const nextCard = images[i+1]
            
            const startProgress = i * segmentLength
            const endProgress = (i+1) * segmentLength

            let localProgress = (progress-startProgress) / segmentLength
            localProgress = gsap.utils.clamp(0, 1, localProgress)
            if(progress > startProgress && progress < endProgress) {
              gsap.to(images, {
                translateY: (k) => images[k] != nextCard ? `${k * -30}%` : '30%',
                translateZ: (k) => `${k*-30}px`,
              })  

            }
          })

        }
      })

  }, {scope: scrollRef})
  return (
    <>
    <Filler />
    <main className={styles.main}>
      <div ref={counterRef} className={styles.counter}>0</div>
      <div ref={scrollRef} className={styles.scrollContainer}>
        <div ref={imageContainer} className={styles.imageContainer}>
          {[...Array(4)].map((_,i) => 
            <div ref={addToRefs} key={i} className={styles.image} />
          )}
        </div>
      </div>
    </main>
          </>
  );
}

const Filler = () => <div style={{height: '50vh', width: '100vw'}} />