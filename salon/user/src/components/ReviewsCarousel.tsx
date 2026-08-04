import { useRef, useState } from "react";
import { Star, Plus, Quote, ImagePlus, X } from "lucide-react";
import { reviews as seedReviews } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  avatarUrl?: string;
}

type RowId = "top" | "bottom";

const ReviewCard = ({
  review,
  onClick,
}: {
  review: Review;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="w-[320px] md:w-[360px] shrink-0 p-6 rounded-2xl bg-card border border-border cursor-pointer hover:border-primary/40 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex gap-1">
        {Array.from({ length: review.rating }).map((_, j) => (
          <Star key={j} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      <Quote className="w-5 h-5 text-primary/20" />
    </div>
    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">"{review.comment}"</p>
    <div className="flex items-center gap-3">
      {review.avatarUrl ? (
        <img
          src={review.avatarUrl}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
          {review.avatar}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-foreground">{review.name}</p>
        <p className="text-xs text-muted-foreground">{review.date}</p>
      </div>
    </div>
  </div>
);

const ReviewsCarousel = ({ rating, totalReviews }: { rating: number; totalReviews: number }) => {
  const [items, setItems] = useState<Review[]>(seedReviews);
  const [hovered, setHovered] = useState<RowId | null>(null);
  const [pinned, setPinned] = useState<RowId | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(5);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const top = items.filter((_, i) => i % 2 === 0);
  const bottom = items.filter((_, i) => i % 2 === 1);

  const isPaused = (row: RowId) => hovered === row || pinned === row;

  const toggle = (row: RowId) => setPinned((prev) => (prev === row ? null : row));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please choose an image file.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please choose an image under 3MB.",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitReview = () => {
    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Missing details",
        description: "Please add your name and a comment before submitting.",
        variant: "destructive",
      });
      return;
    }
    const newReview: Review = {
      id: Date.now(),
      name: name.trim(),
      rating: rate,
      comment: comment.trim(),
      date: "Just now",
      avatar: name.trim().charAt(0).toUpperCase(),
      avatarUrl: photo || undefined,
    };
    setItems((prev) => [newReview, ...prev]);
    setName("");
    setComment("");
    setRate(5);
    removePhoto();
    setOpen(false);
    toast({ title: "Review submitted", description: "Thanks for sharing your experience!" });
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="section-heading mb-2">Client Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-lg font-semibold">{rating}</span>
              <span className="text-muted-foreground">({totalReviews} reviews)</span>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Write a Review
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {(["top", "bottom"] as RowId[]).map((row) => {
          const rowItems = row === "top" ? top : bottom;
          const direction = row === "top" ? "scroll-left" : "scroll-right";
          return (
            <div
              key={row}
              className="relative overflow-hidden"
              onMouseEnter={() => setHovered(row)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent" />
              <div
                className={`flex gap-6 w-max ${direction}`}
                style={{ animationPlayState: isPaused(row) ? "paused" : "running" }}
              >
                {[...rowItems, ...rowItems].map((review, i) => (
                  <ReviewCard key={`${row}-${review.id}-${i}`} review={review} onClick={() => toggle(row)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes scrollLeftKeyframes {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollRightKeyframes {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .scroll-left {
          animation: scrollLeftKeyframes 40s linear infinite;
        }
        .scroll-right {
          animation: scrollRightKeyframes 40s linear infinite;
        }
      `}</style>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="review-name">Your Name</Label>
              <Input
                id="review-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Your Photo (optional)</Label>
              <div className="mt-1 flex items-center gap-3">
                {photo ? (
                  <div className="relative">
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      aria-label="Remove photo"
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                  </button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photo ? "Change photo" : "Upload photo"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRate(i + 1)}
                    aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        i < rate ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your visit..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { removePhoto(); setOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={submitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsCarousel;
