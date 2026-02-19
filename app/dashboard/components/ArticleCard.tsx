'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ArticleCardProps {
    title: string
    description: string
    image: string
    href: string
    delay?: number
}

export default function ArticleCard({ title, description, image, href, delay = 0 }: ArticleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Link href={href} className="group block h-full">
                <div
                    className="relative overflow-hidden rounded-2xl h-full border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    style={{
                        backgroundColor: 'var(--main-container-bg)',
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--container-shadow)'
                    }}
                >
                    <div className="flex flex-col sm:flex-row h-full">
                        <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </div>

                        <div className="p-5 sm:w-2/3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                    {description}
                                </p>
                            </div>

                            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                Read Article <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
