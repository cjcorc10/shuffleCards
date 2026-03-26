"use client";
import styles from "./page.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const FOCUSED_IMAGES = 2;
const GAP = 30;

export default function Home() {
  const scrollRef = useRef(null);
  const counterRef = useRef(null);
  const imagesRef = useRef([]);
  const imageContainer = useRef(null);
  const addToRefs = (e) => {
    if (e && !imagesRef.current.includes(e))
      imagesRef.current.push(e);
  };

  const getCards = (images, index) => {
    if (index === images.length - 1) return images.slice(1, index);
    return [
      ...images.slice(index + FOCUSED_IMAGES),
      ...images.slice(0, index),
    ];
  };

  useGSAP(
    () => {
      if (!scrollRef) return;
      const images = imagesRef.current;
      const numImages = images.length;
      if (!numImages) return;

      ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "+=1600px",
        pin: true,
        scrub: 1,
        markers: true,
        onUpdate: (self) => {
          const { progress } = self;
          const steps = images.length;
          const segmentLength = 1 / steps;

          images.forEach((img, i) => {
            const frontCards = [img, images[i + 1] || images[0]];
            const backgroundCards = getCards(images, i);

            const startProgress = i * segmentLength;
            const endProgress = (i + 1) * segmentLength;

            let localProgress =
              (progress - startProgress) / segmentLength;
            localProgress = gsap.utils.clamp(0, 1, localProgress);

            if (progress > startProgress && progress < endProgress) {
              gsap.to(frontCards, {
                translateY: (k) => (k === 0 ? `0%` : `${GAP}%`),
                translateZ: (k) => (k ? `${numImages * -GAP}px` : 0),
              });
              gsap.to(backgroundCards, {
                translateY: (k) =>
                  `${(numImages - FOCUSED_IMAGES - k) * -GAP}%`,
                translateZ: (k) =>
                  `${(numImages - FOCUSED_IMAGES - k) * -GAP}px`,
              });
              gsap.to(imageContainer.current, {
                translateY: localProgress * -150,
              });
            }
          });
        },
      });
    },
    { scope: scrollRef },
  );
  return (
    <>
      <Filler />
      <main className={styles.main}>
        <div ref={counterRef} className={styles.counter}>
          0
        </div>
        <div ref={scrollRef} className={styles.scrollContainer}>
          <div ref={imageContainer} className={styles.imageContainer}>
            {[...Array(4)].map((_, i) => (
              <div ref={addToRefs} key={i} className={styles.image} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

const Filler = () => (
  <div style={{ height: "50vh", width: "100vw" }} />
);
