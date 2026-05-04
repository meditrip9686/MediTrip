import { Link } from 'react-router-dom';
import { 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import PageMeta from '../components/common/PageMeta';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

const FALLBACK_POSTS = [
  {
    id: 1,
    title: 'Why India is the Hub for Robotic Knee Replacement',
    excerpt: 'Discover how robotic technology is revolutionizing orthopedic surgery in India with higher precision and faster recovery.',
    category: 'Technology',
    author: 'Dr. Vikram Shah',
    date: 'Oct 24, 2023',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Medical Visa Guide for International Patients (2024)',
    excerpt: 'A comprehensive step-by-step guide to applying for an Indian Medical Visa (e-Medical Visa) including required documents.',
    category: 'Travel Guide',
    author: 'MediTrip Concierge',
    date: 'Oct 20, 2023',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd4f79c3f2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Success Story: John Doe’s Cardiac Recovery Journey',
    excerpt: 'Read how John saved 70% on his bypass surgery while receiving care at a JCI accredited hospital in Chennai.',
    category: 'Success Stories',
    author: 'Patient Support',
    date: 'Oct 15, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'
  }
];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>(FALLBACK_POSTS);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, author:profiles(full_name, avatar_url)')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          // Map to match the UI shape
          const dbPosts = data.map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.body?.substring(0, 120) + '...',
            category: (p.tags && p.tags[0]) || 'General',
            author: p.author?.full_name || 'Medical Team',
            date: new Date(p.published_at || p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: Math.ceil((p.body?.length || 0) / 1500) + ' min read',
            image: p.featured_image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
          }));
          setPosts(dbPosts);
        }
      } catch (err) {
        console.error('Failed to load posts', err);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="Medical Blog & Patient Guides" 
        description="Read expert medical articles, patient success stories, and essential travel guides for your medical journey." 
      />
      {/* Premium Header */}
      <div className="relative pt-32 pb-24 bg-dark overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute top-0 left-0 w-1/4 h-full bg-primary-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="section-tag !text-primary-400">Health Journal</span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Insights & <span className="text-primary-400">Expertise</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Expert medical advice, patient success stories, and comprehensive guides for your healthcare journey in India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="premium-card !p-0 overflow-hidden mb-16 shadow-2xl group flex flex-col lg:flex-row">
            <div className="lg:w-1/2 overflow-hidden h-[300px] lg:h-auto">
              <img 
                src={posts[0].image} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="badge-blue !bg-primary-500 !text-white !rounded-xl !py-1.5">{posts[0].category}</span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {posts[0].readTime}
                </span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-dark mb-6 group-hover:text-primary-600 transition-colors leading-tight">
                {posts[0].title}
              </h2>
              <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium line-clamp-3">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 border border-slate-200 uppercase">
                    {posts[0].author ? posts[0].author[0] : 'M'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-dark">{posts[0].author}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{posts[0].date}</p>
                  </div>
                </div>
                <Link to={posts[0].slug ? `/blog/${posts[0].slug}` : `/blog/${posts[0].id}`} className="w-14 h-14 bg-dark rounded-2xl flex items-center justify-center text-white hover:bg-primary-600 hover:scale-110 transition-all shadow-xl">
                  <ArrowUpRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {['All Posts', 'Medical News', 'Technology', 'Patient Stories', 'Travel Guides', 'Recovery'].map(cat => (
            <button key={cat} className="px-8 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-primary-200 transition-all">
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, i) => (
            <Link 
              key={post.id || i} 
              to={post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`}
              className="premium-card !p-0 overflow-hidden group flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-blue !bg-primary-50 !text-primary-600 !rounded-lg !text-[10px] uppercase font-black tracking-widest">{post.category}</span>
                  <span className="text-slate-300 text-xs font-bold">•</span>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-dark group-hover:text-primary-600 transition-colors mb-4 leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                      {post.author ? post.author[0] : 'M'}
                    </div>
                    <span className="text-xs font-bold text-slate-400">{post.author}</span>
                  </div>
                  <div className="text-primary-500 flex items-center gap-1 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    Read <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Newsletter Card */}
          <div className="premium-card !bg-primary-600 border-none text-white flex flex-col justify-center text-center p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <TrendingUp className="w-12 h-12 text-primary-200 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold mb-4">Stay Informed</h3>
            <p className="text-primary-100 text-sm mb-8 font-medium">Get the latest healthcare trends and hospital updates delivered to your inbox.</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl py-4 px-6 focus:ring-white/20 focus:bg-white/20 text-sm transition-all"
              />
              <button className="btn-secondary !bg-white !text-primary-600 w-full justify-center !py-4 font-black shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
