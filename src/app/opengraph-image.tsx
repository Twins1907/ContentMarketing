import { ImageResponse } from "next/og";

export const alt = "Orbyt — AI Content Strategy Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFF8F0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "#A6FAFF",
            border: "3px solid #000",
            transform: "rotate(-12deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 100,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#FFA6F6",
            border: "3px solid #000",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 120,
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: "#FFF066",
            border: "3px solid #000",
            transform: "rotate(20deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            width: 70,
            height: 70,
            borderRadius: 14,
            backgroundColor: "#B8FF9F",
            border: "3px solid #000",
            transform: "rotate(-8deg)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-2px",
            color: "#000",
            marginBottom: 16,
          }}
        >
          ORBYT
        </div>

        {/* Tagline card */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#fff",
            border: "3px solid #000",
            borderRadius: 16,
            padding: "20px 40px",
            boxShadow: "6px 6px 0px #000",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#000",
              lineHeight: 1.4,
            }}
          >
            Your $3,000 Content Strategist — For Free
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            color: "#666",
            marginTop: 20,
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          AI-generated content strategies with production-ready briefs for every
          post.
        </div>

        {/* Bottom pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 30,
          }}
        >
          {["Content Calendar", "Audience Persona", "Post Briefs"].map(
            (label) => (
              <div
                key={label}
                style={{
                  backgroundColor: "#A8A6FF",
                  border: "2px solid #000",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
