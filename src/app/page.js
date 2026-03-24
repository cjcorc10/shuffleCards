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
  const done = useRef(false);
  const addToRefs = (e) => {
    if(e && !imagesRef.current.includes(e)) imagesRef.current.push(e)
  }

  useGSAP(() => {
    if(!scrollRef) return
    const images = imagesRef.current
    gsap.set(images, {
      y: (i) => (i == images.length-1 ? 50 : i*-50),
      translateZ: (i) => `${i*-50}px`,
      transformOrigin: (i) => 'top center'
    })

  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollRef.current,
        start: "top top",
        end: "+=1600px",
        pin: true,
        scrub: 1,
        markers: true,
        onUpdate: (self) => {
          const {progress} = self;

        }

      }
    });

    images.map((image, i) => {
      const lastImage = images[images.length-1]
      // if(!lastImage) return
      tl.to(images, {
        y: (i) => (i == images.length-1 ? 50 : i*-50),            
        translateZ: (i) => `${i*-50}px`,
      })
      images.unshift(images.pop())
    })


  }, {scope: scrollRef})
  return (
    <main className={styles.main}>
      <div ref={counterRef} className={styles.counter}>0</div>
      <div ref={scrollRef} className={styles.scrollContainer}>
        <div className={styles.imageContainer}>
          {[...Array(4)].map((_,i) => 
            <div ref={addToRefs} key={i} className={styles.image} />
          )}
        </div>
      </div>
    </main>
  );
}
