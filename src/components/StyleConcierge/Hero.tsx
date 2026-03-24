import { useEffect, useState } from "react";

const Hero = ({ compact }: { compact?: boolean }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <section className={`relative flex flex-col items-center justify-center text-center transition-all duration-700 ease-out ${compact ? "pt-20 pb-4" : "pt-28 pb-8 md:pt-36 md:pb-12"}`}>
      {/* Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-hero-glow transition-all duration-700 ${compact ? "w-[200px] h-[200px]" : "w-[340px] h-[340px] md:w-[500px] md:h-[500px]"}`}
        style={{ background: "radial-gradient(circle, hsla(18,100%,50%,0.12) 0%, transparent 70%)" }}
      />

      <h1
        className={`font-display font-bold tracking-tight text-foreground relative z-10 transition-all duration-700 ${compact ? "text-2xl md:text-3xl" : "text-4xl md:text-6xl lg:text-7xl"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ lineHeight: compact ? "1.2" : "1.1", transitionDelay: "0.1s" }}
      >
        Hey ! I am{" "}
        <span
          className="text-gradient-orange inline-block animate-dripstr-glow"
          style={{ animationDelay: "0.5s" }}
        >
          DRIPSTR
        </span>
        ,
        <br />
        <span className="text-muted-foreground font-medium" style={{ fontSize: "0.6em" }}>Your fashion stylist</span>
      </h1>

      <p
        className={`text-muted-foreground relative z-10 transition-all duration-700 ${compact ? "text-sm mt-2" : "text-base md:text-lg mt-4 md:mt-6"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "0.3s" }}
      >
        Curated outfit ideas, fast.
      </p>
    </section>
  );
};

export default Hero;
