"use client";

import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

export default function ParticleBackground({ id = "tsparticles" }: { id?: string }) {
  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id={id}
        className="absolute inset-0 z-0 pointer-events-none"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 120,
              enable: true,
              opacity: 0.15,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 0.4,
              straight: false,
            },
            number: {
              density: { enable: true, width: 1920, height: 1080 },
              value: 50,
            },
            opacity: { value: 0.2 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } },
          },
          detectRetina: true,
        }}
      />
    </ParticlesProvider>
  );
}
