"use client"
import { motion } from 'framer-motion'
import { ArrowRight, BikeIcon, ShoppingBasket } from 'lucide-react'
import React from 'react'

type WelcomeProps = {
  nextstep: (step: number) => void
}

function Welcome({ nextstep }: WelcomeProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}   
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        
        {/* Header */}
        <div className='flex items-center justify-center gap-3 mb-4'>
          <ShoppingBasket className='text-green-500' size={48} />
          <h1 className='text-4xl font-bold text-green-700'>
            Welcome to QuickBasket!
          </h1>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}   
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='text-lg text-gray-700 mb-6 max-w-xl leading-relaxed'
        >
          Discover a smarter way to shop for groceries with QuickBasket, designed to save your time and effortFrom fresh fruits and vegetables to daily essentials, everything you need is just a few clicks away Enjoy fast, reliable delivery and a seamless shopping experience right at your doorstep.
        </motion.p>

        {/* Button */}
        <motion.button
          onClick={() => nextstep(2)}  
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 flex items-center gap-2 mx-auto'
        >
          Next <ArrowRight size={20} />
        </motion.button>

      </motion.div>

      {/* Icons Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}   
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className='mt-12 flex items-center justify-center gap-10'
      >
        <motion.div whileHover={{ scale: 1.2 }}>
          <BikeIcon className='text-orange-400 drop-shadow-lg' size={100} />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }}>
          <ShoppingBasket className='text-green-500 drop-shadow-lg' size={100} />
        </motion.div>
      </motion.div>

    </div>
  )
}

export default Welcome