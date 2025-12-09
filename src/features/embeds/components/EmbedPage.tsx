"use client";

import { publicAnonKey, getApiUrl } from "@/lib/supabase/info";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  type: "text" | "video" | "image";
  content: string;
  customerName: string;
  customerJobTitle?: string;
  customerCompany?: string;
  customerAvatar?: string;
  status: "pending" | "approved";
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export function EmbedPage() {
  const searchParams = useSearchParams();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = searchParams.get("project");
  const type = searchParams.get("type") || "carousel";
  const autoplay = searchParams.get("autoplay") === "true";
  const showNavigation = searchParams.get("navigation") !== "false"; // Default true
  const columns = parseInt(searchParams.get("columns") || "3");
  const theme = searchParams.get("theme") || "light";
  const limit = searchParams.get("limit") || "all"; // 'all' or a number

  // Fetch testimonials from API
  useEffect(() => {
    if (!projectId) {
      setError("No se proporcionó ID de proyecto");
      setLoading(false);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          getApiUrl(`/public/projects/${projectId}/testimonials`),
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar testimonios");
        }

        const data = await response.json();
        let fetchedTestimonials = data.testimonials || [];

        // Sort by most recent first
        fetchedTestimonials.sort((a: Testimonial, b: Testimonial) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // Apply limit if specified
        if (limit !== "all") {
          const limitNum = parseInt(limit);
          if (!isNaN(limitNum) && limitNum > 0) {
            fetchedTestimonials = fetchedTestimonials.slice(0, limitNum);
          }
        }

        setTestimonials(fetchedTestimonials);
        setError(null);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Error al cargar los testimonios");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [projectId, limit]);

  // Autoplay effect
  useEffect(() => {
    if (autoplay && type === "carousel" && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, type, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Theme styles
  const isDark = theme === "dark";
  const styles = {
    bg: isDark ? "#111827" : "#f9fafb",
    cardBg: isDark ? "#1f2937" : "#ffffff",
    textPrimary: isDark ? "#ffffff" : "#111827",
    textSecondary: isDark ? "#9ca3af" : "#6b7280",
    border: isDark ? "#374151" : "#e5e7eb",
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: styles.bg,
          color: styles.textPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <p>Cargando testimonios...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: styles.bg,
          color: styles.textPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: styles.bg,
          color: styles.textPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <p>No hay testimonios aprobados disponibles</p>
      </div>
    );
  }

  // Helper to extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Render media based on type
  const renderMedia = (testimonial: Testimonial, size: "large" | "small" = "large") => {
    if (testimonial.type === "image" && testimonial.imageUrl) {
      return (
        <div
          style={{
            marginBottom: size === "large" ? "1.5rem" : "1rem",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <img
            src={testimonial.imageUrl}
            alt={`Testimonio de ${testimonial.customerName}`}
            style={{
              width: "100%",
              height: size === "large" ? "300px" : "200px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      );
    }

    if (testimonial.type === "video" && testimonial.videoUrl) {
      const videoId = getYouTubeVideoId(testimonial.videoUrl);
      if (videoId) {
        return (
          <div
            style={{
              marginBottom: size === "large" ? "1.5rem" : "1rem",
              borderRadius: "0.75rem",
              overflow: "hidden",
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        );
      }
    }

    return null;
  };

  // Carousel Layout
  if (type === "carousel") {
    const current = testimonials[currentIndex];

    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: styles.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: "56rem", width: "100%", position: "relative" }}>
          <div
            style={{
              backgroundColor: styles.cardBg,
              borderRadius: "1rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "3rem 2rem",
              border: `1px solid ${styles.border}`,
            }}
          >
            {/* Media (Image or Video) */}
            {renderMedia(current, "large")}

            {/* Quote */}
            {current.content && (
              <blockquote
                style={{
                  fontSize: "1.25rem",
                  color: styles.textPrimary,
                  textAlign: "center",
                  marginBottom: "2rem",
                  lineHeight: "1.75",
                  fontStyle: "italic",
                }}
              >
                "{current.content}"
              </blockquote>
            )}

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.125rem" }}>{current.customerName.charAt(0)}</span>
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontWeight: "600", color: styles.textPrimary, margin: 0 }}>{current.customerName}</p>
                {(current.customerJobTitle || current.customerCompany) && (
                  <p style={{ fontSize: "0.875rem", color: styles.textSecondary, margin: 0 }}>
                    {[current.customerJobTitle, current.customerCompany].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          {showNavigation && testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                style={{
                  position: "absolute",
                  left: "-1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: styles.cardBg,
                  border: `1px solid ${styles.border}`,
                  borderRadius: "50%",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseOut={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
                aria-label="Anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={styles.textPrimary} strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button
                onClick={nextTestimonial}
                style={{
                  position: "absolute",
                  right: "-1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: styles.cardBg,
                  border: `1px solid ${styles.border}`,
                  borderRadius: "50%",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseOut={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
                aria-label="Siguiente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={styles.textPrimary} strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      width: index === currentIndex ? "2rem" : "0.5rem",
                      height: "0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor: index === currentIndex ? "#3b82f6" : isDark ? "#374151" : "#d1d5db",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      padding: 0,
                    }}
                    aria-label={`Ir al testimonio ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Grid Layout
  const gridColumns = Math.min(columns, testimonials.length);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: styles.bg,
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gap: "1.5rem",
          }}
        >
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              style={{
                backgroundColor: styles.cardBg,
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                border: `1px solid ${styles.border}`,
                transition: "box-shadow 0.2s",
              }}
              onMouseOver={e => (e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)")}
              onMouseOut={e => (e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)")}
            >
              {/* Media (Image or Video) */}
              {renderMedia(testimonial, "small")}

              {/* Quote */}
              {testimonial.content && (
                <blockquote
                  style={{
                    color: styles.textPrimary,
                    marginBottom: "1.5rem",
                    lineHeight: "1.625",
                    fontStyle: "italic",
                  }}
                >
                  "{testimonial.content}"
                </blockquote>
              )}

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  paddingTop: "1rem",
                  borderTop: `1px solid ${styles.border}`,
                }}
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#ffffff", fontWeight: "500", fontSize: "0.875rem" }}>{testimonial.customerName.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ fontWeight: "500", color: styles.textPrimary, fontSize: "0.875rem", margin: 0 }}>{testimonial.customerName}</p>
                  {(testimonial.customerJobTitle || testimonial.customerCompany) && (
                    <p style={{ fontSize: "0.75rem", color: styles.textSecondary, margin: 0 }}>
                      {[testimonial.customerJobTitle, testimonial.customerCompany].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
