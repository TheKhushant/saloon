import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/data/mockData";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageHero
      eyebrow="Our Journal"
      title="Grooming Tips & Blog"
      description="Expert men's grooming advice, trend reports and behind-the-chair stories."
      crumbs={[{ label: "Blog" }]}
    />
    <div className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href={`https://www.google.com/search?q=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-salon luxury-card cursor-pointer group block"
            >
              <div className="salon-image-wrap h-48">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-primary tracking-wide uppercase">{post.category}</span>
                <h3 className="font-heading font-semibold text-lg mt-1 mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all btn-underline-slide">
                    Read More <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Blog;
