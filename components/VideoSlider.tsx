'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const videos = [
    // Students / Campus
    'https://assets.mixkit.co/videos/preview/mixkit-group-of-students-walking-in-university-hallway-4626-large.mp4',
    // IT / Coding
    'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-monitor-close-up-1728-large.mp4',
    // Architecture / Design
    'https://assets.mixkit.co/videos/preview/mixkit-architect-working-on-a-model-house-3344-large.mp4',
    // Science / Lab
    'https://assets.mixkit.co/videos/preview/mixkit-scientist-looking-through-microscope-in-laboratory-1703-large.mp4',
    // Aviation / Planes (Metaphor for "Going anywhere")
    'https://assets.mixkit.co/videos/preview/mixkit-airplane-taking-off-in-the-sunset-356-large.mp4',
]

export default function VideoSlider() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % videos.length)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden bg-black">
            <AnimatePresence mode='wait'>
                <motion.video
                    key={current}
                    src={videos[current]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            </AnimatePresence>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    )
}
