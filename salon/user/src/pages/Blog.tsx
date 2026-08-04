import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/mockData";
import { motion } from "framer-motion";

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="section-heading mb-2">Grooming Tips & Blog</h1>
        <p className="text-muted-foreground mb-10">Expert men's grooming advice & trending tips</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-salon cursor-pointer"
            >
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs font-medium text-primary">{post.category}</span>
                <h3 className="font-heading font-semibold text-lg mt-1 mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Blog;
