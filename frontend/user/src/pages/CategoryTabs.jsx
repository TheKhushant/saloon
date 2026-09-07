import { motion } from "framer-motion";

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-8 overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 min-w-max pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-6 py-3 rounded-xl font-medium transition-all ${
              activeCategory === category.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;