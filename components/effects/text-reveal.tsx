"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  type?: 'words' | 'chars' | 'lines'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.05,
  type = 'words',
  tag: Tag = 'span',
}: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const getItems = () => {
    if (type === 'chars') {
      return children.split('')
    } else if (type === 'lines') {
      return children.split('\n')
    }
    return children.split(' ')
  }

  const items = getItems()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: any = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <Tag ref={ref} className={className}>
      <motion.span
        className="inline-flex flex-wrap"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
            style={{ perspective: '1000px' }}
          >
            {item}
            {type === 'words' && index < items.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}

// Typewriter effect component
interface TypewriterProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
}

export function Typewriter({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
}: TypewriterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <span ref={ref} className={className}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay }}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              delay: delay + index * (speed / 1000),
              duration: 0.01,
            }}
          >
            {char}
          </motion.span>
        ))}
        {cursor && (
          <motion.span
            className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </motion.span>
    </span>
  )
}

// Scramble text effect
interface ScrambleTextProps {
  text: string
  className?: string
  duration?: number
}

export function ScrambleText({ text, className = '', duration = 1 }: ScrambleTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                }
              : {}
          }
          transition={{
            delay: (index * duration) / text.length,
            duration: 0.1,
          }}
        >
          {char === ' ' ? '\u00A0' : (
            <motion.span
              animate={
                isInView
                  ? {
                      content: [
                        chars[Math.floor(Math.random() * chars.length)],
                        chars[Math.floor(Math.random() * chars.length)],
                        chars[Math.floor(Math.random() * chars.length)],
                        char,
                      ],
                    }
                  : {}
              }
              transition={{
                delay: (index * duration) / text.length,
                duration: 0.3,
                times: [0, 0.3, 0.6, 1],
              }}
            >
              {char}
            </motion.span>
          )}
        </motion.span>
      ))}
    </span>
  )
}
