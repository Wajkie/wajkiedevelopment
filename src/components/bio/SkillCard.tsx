'use client';

import { useState } from 'react';

interface SkillCardProps {
  name: string;
  icon: string;
  color: string;
  index: number;
}

const colorClasses = {
  blue: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-700 dark:text-blue-300',
  slate: 'bg-slate-500/10 border-slate-500/20 hover:border-slate-500/40 text-slate-700 dark:text-slate-300',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-700 dark:text-cyan-300',
  orange: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40 text-orange-700 dark:text-orange-300',
  green: 'bg-green-500/10 border-green-500/20 hover:border-green-500/40 text-green-700 dark:text-green-300',
  purple: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40 text-purple-700 dark:text-purple-300',
  indigo: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-700 dark:text-indigo-300',
  pink: 'bg-pink-500/10 border-pink-500/20 hover:border-pink-500/40 text-pink-700 dark:text-pink-300',
  red: 'bg-red-500/10 border-red-500/20 hover:border-red-500/40 text-red-700 dark:text-red-300',
};

export const SkillCard = ({ name, icon, color, index }: SkillCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border-2 p-4 
        transition-all duration-300 cursor-default
        hover:scale-105 hover:shadow-lg
        animate-fade-in-up
        ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}
      `}
      style={{
        animationDelay: `${index * 50}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <span 
          className={`text-2xl transition-transform duration-300 ${
            isHovered ? 'scale-125 rotate-12' : ''
          }`}
        >
          {icon}
        </span>
        <span className="font-medium">{name}</span>
      </div>
      
      {/* Animated background effect */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 
          dark:from-white/0 dark:to-white/5
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
};
