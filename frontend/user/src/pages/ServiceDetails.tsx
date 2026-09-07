import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Star, Users, CheckCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchPublicService, type ApiService } from "@/lib/servicesApi";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchPublicService(id)
      .then((data) => {
        if (!cancelled) setService(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 container mx-auto px-4 text-center text-muted-foreground">
          Loading service...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="section-heading mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the service you're looking for. It may have been removed or renamed.
          </p>
          <Link to="/service" className="btn-gold btn-elastic">
            Browse All Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        eyebrow="Service Details"
        title={service.name}
        description={service.description}
        image={service.image}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/service" },
          { label: service.name },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-8 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Image + description */}
            <div className="lg:col-span-2">
              {service.image && (
                <div className="rounded-2xl overflow-hidden mb-8 h-80">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="font-heading text-2xl font-semibold mb-3">About this service</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {service.description}
              </p>

              {service.benefits && service.benefits.length > 0 && (
                <>
                  <h3 className="font-heading text-lg font-semibold mb-4">What's included</h3>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary rounded-lg text-xs text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Booking summary card */}
            <div>
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{service.rating ?? 0}</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>

                <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">₹{service.price}</span>
                  {service.originalPrice && (
                    <span className="text-base text-muted-foreground line-through mb-1">
                      ₹{service.originalPrice}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.durationMinutes} min duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{service.stylists ?? 0}+ specialists available</span>
                  </div>
                </div>

                <Link
                  to={`/book/${service.id}`}
                  className="block w-full text-center py-3 rounded-xl btn-gold btn-glow font-medium"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetails;
