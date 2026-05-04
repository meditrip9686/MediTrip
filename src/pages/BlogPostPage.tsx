import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from 'lucide-react';
import PageMeta from '../components/common/PageMeta';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, author:profiles(full_name, avatar_url)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary-600 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title={post.title || "Blog Post"} 
        description={post.body ? post.body.substring(0, 160) : "Read our latest medical insights"} 
      />
      
      {/* Article Header */}
      <div className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="text-sm font-bold text-primary-600 mb-8 inline-flex items-center gap-2 hover:text-primary-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Health Journal
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            {post.tags && post.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-dark mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author?.full_name || 'Medical Team'}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {Math.ceil((post.body?.length || 0) / 1500)} min read
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-16">
          <div className="aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl bg-gray-100">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <article className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:text-dark
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-3xl prose-img:shadow-xl
          prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-dark prose-blockquote:font-medium">
          {/* Extremely basic markdown to HTML for MVP. In production, use a library like marked or react-markdown */}
          <div dangerouslySetInnerHTML={{ __html: (post.body || '').replace(/\n/g, '<br/>') }} />
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-dark">Share this article:</span>
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
