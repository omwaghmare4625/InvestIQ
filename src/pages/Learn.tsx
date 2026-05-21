import React from 'react';
import { BookOpen, Play, Clock, Star, Search, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Card, Button } from '@/components/ui/Common';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const categories = ['All', 'Basics', 'Technical Analysis', 'Crypto', 'Tax & Planning'];

const courses = [
  {
    title: 'Investing Basics',
    duration: '45m',
    level: 'Beginner',
    rating: 4.8,
    lessons: 8,
    image: 'https://picsum.photos/seed/finance1/400/200',
    category: 'Basics',
    progress: 65,
  },
  {
    title: 'Advanced Options Trading',
    duration: '2h 15m',
    level: 'Advanced',
    rating: 4.9,
    lessons: 14,
    image: 'https://picsum.photos/seed/finance2/400/200',
    category: 'Technical Analysis',
    progress: 0,
  },
  {
    title: 'Crypto Fundamentals',
    duration: '1h 30m',
    level: 'Intermediate',
    rating: 4.7,
    lessons: 10,
    image: 'https://picsum.photos/seed/finance3/400/200',
    category: 'Crypto',
    progress: 0,
  },
  {
    title: 'Tax-Efficient Investing',
    duration: '55m',
    level: 'Intermediate',
    rating: 4.6,
    lessons: 6,
    image: 'https://picsum.photos/seed/finance4/400/200',
    category: 'Tax & Planning',
    progress: 0,
  },
  {
    title: 'Reading Candlestick Charts',
    duration: '1h 10m',
    level: 'Beginner',
    rating: 4.8,
    lessons: 9,
    image: 'https://picsum.photos/seed/finance5/400/200',
    category: 'Technical Analysis',
    progress: 30,
  },
  {
    title: 'Portfolio Diversification',
    duration: '40m',
    level: 'Beginner',
    rating: 4.5,
    lessons: 5,
    image: 'https://picsum.photos/seed/finance6/400/200',
    category: 'Basics',
    progress: 0,
  },
];

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-500',
  Intermediate: 'bg-amber-500/10 text-amber-500',
  Advanced: 'bg-red-500/10 text-red-500',
};

export default function Learn() {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [search, setSearch] = React.useState('');

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100);

  return (
    <motion.div
      className="space-y-12 pb-20"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.header variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-4xl font-display font-semibold tracking-normal text-text-primary mb-2">
          Knowledge Analysis
        </h1>
        <p className="text-text-dim text-sm font-medium text-text-muted">Learning Center</p>
      </motion.header>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        {[
          { icon: BookOpen, label: 'Knowledge Units', value: '24', color: 'text-primary' },
          {
            icon: TrendingUp,
            label: 'Current Holdings',
            value: `${inProgress.length}`,
            color: 'text-tertiary',
          },
          { icon: Award, label: 'Synthesized', value: '12', color: 'text-success' },
          { icon: BarChart3, label: 'Training Epochs', value: '156h', color: 'text-danger' },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="p-6 flex items-center gap-4 glass-card border-border bg-surface-low/20 backdrop-blur-3xl hover:border-border transition-all group"
          >
            <div className="w-12 h-12 bg-surface-elevated border border-border rounded-lg flex items-center justify-center group-hover:bg-surface-elevated transition-all">
              <stat.icon className={cn('w-6 h-6', stat.color)} />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-text-dim/40 tracking-wide mb-1 group-hover:text-text-dim/60 transition-colors">
                {stat.label}
              </p>
              <p className="text-xl font-display font-semibold text-text-primary group-hover:text-primary transition-colors">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <h2 className="text-[11px] font-semibold tracking-wide text-text-primary mb-6 border-b border-border pb-4">
            Active Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inProgress.map((course) => (
              <Card
                key={course.title}
                className="p-0 overflow-hidden flex group cursor-pointer glass-card border-border bg-surface-low/20 backdrop-blur-2xl hover:bg-surface-low/30 hover:border-border transition-all duration-500"
                onClick={() => toast.info('Neural link pending initialization')}
              >
                <div className="w-40 h-full relative overflow-hidden flex-shrink-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-display font-medium text-sm text-text-primary tracking-normal mb-2">
                      {course.title}
                    </p>
                    <p className="text-[10px] font-semibold text-text-dim/40 tracking-wide">
                      {course.lessons} Modules · {course.duration}
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide mb-3">
                      <span className="text-primary">{course.progress}% Efficiency</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-glow-sm"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim/30" />
          <input
            type="text"
            placeholder="Search intelligence cache..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-elevated border border-border rounded-md pl-12 pr-4 py-4 text-[13px] font-medium text-text-primary placeholder:text-text-dim/20 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-6 py-3 rounded-md text-[9px] font-semibold tracking-wide transition-all duration-300',
                activeCategory === cat
                  ? 'bg-primary text-background shadow-glow'
                  : 'bg-surface-elevated border border-border text-text-dim hover:text-text-primary hover:border-border'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        {filtered.map((course) => (
          <Card
            key={course.title}
            className="p-0 overflow-hidden group cursor-pointer glass-card border-border bg-surface-low/20 backdrop-blur-2xl hover:bg-surface-low/30 hover:border-border transition-all duration-500"
            onClick={() => toast.info('Neural link pending initialization')}
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover grayscale-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                  <Play className="w-6 h-6 text-background fill-current ml-1" />
                </div>
              </div>
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-elevated">
                  <div
                    className="h-full bg-primary shadow-glow-sm"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={cn(
                    'px-3 py-1 rounded-sm text-[8px] font-semibold tracking-wide border border-white/5',
                    levelColors[course.level]
                  )}
                >
                  {course.level}
                </span>
                <span className="text-[10px] text-text-dim/40 font-semibold tracking-wide">
                  {course.lessons} Modules
                </span>
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary tracking-normal mb-6 h-12 overflow-hidden line-clamp-2">
                {course.title}
              </h3>
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 text-[10px] font-semibold text-text-dim/60 tracking-wide leading-none">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-semibold text-tertiary tracking-wide leading-none">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {course.rating}
                  </span>
                </div>
                <button className="text-primary text-[10px] font-semibold tracking-wide group-hover:underline">
                  {course.progress > 0 ? 'Resume' : 'Initialize'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-32 glass-card border-border bg-surface-low/10 rounded-xl">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-text-dim/20" />
          <p className="font-display font-semibold text-text-primary tracking-wide mb-2">Cache Empty</p>
          <p className="text-[12px] text-text-dim/40 font-medium">
            No results matched your search parameters.
          </p>
        </div>
      )}
    </motion.div>
  );
}
