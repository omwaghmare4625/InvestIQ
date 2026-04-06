import React from 'react';
import { BookOpen, Play, Clock, Star } from 'lucide-react';
import { Card } from '@/components/ui/Common';

const courses = [
  { title: 'Investing Basics', duration: '45m', level: 'Beginner', rating: 4.8, image: 'https://picsum.photos/seed/finance1/400/200' },
  { title: 'Advanced Options Trading', duration: '2h 15m', level: 'Advanced', rating: 4.9, image: 'https://picsum.photos/seed/finance2/400/200' },
  { title: 'Crypto Fundamentals', duration: '1h 30m', level: 'Intermediate', rating: 4.7, image: 'https://picsum.photos/seed/finance3/400/200' },
  { title: 'Tax-Efficient Investing', duration: '55m', level: 'Intermediate', rating: 4.6, image: 'https://picsum.photos/seed/finance4/400/200' },
];

export default function Learn() {
  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
        <p className="text-text-muted mt-1">Master the markets with our curated financial education.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.title} className="p-0 overflow-hidden group cursor-pointer">
            <div className="relative h-48">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {course.level}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">{course.title}</h3>
              <div className="flex items-center justify-between text-sm text-text-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    {course.rating}
                  </span>
                </div>
                <button className="text-primary font-bold hover:underline">Start Course</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
