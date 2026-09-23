import { motion } from "framer-motion";
import { projects } from "@/data/projects";

const paths = [
  "M200 20 C200 90 120 110 90 180 C70 230 80 280 70 330",
  "M200 20 C200 100 170 140 160 200 C150 260 160 300 155 345",
  "M200 20 C200 100 230 140 245 205 C258 262 250 300 255 345",
  "M200 20 C200 90 285 110 315 180 C338 232 330 285 340 330",
];

const nodes = [
  { x: 70, y: 340 },
  { x: 155, y: 355 },
  { x: 255, y: 355 },
  { x: 340, y: 340 },
];

/** Ilustración de raíces que crecen y conectan los 4 proyectos con la red Stellar. */
export function RootsNetwork() {
  return (
    <svg
      viewBox="0 0 410 400"
      role="img"
      aria-label="Raíces que conectan cuatro nodos luminosos de la red Stellar"
      className="h-auto w-full max-w-[460px]"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.line
        x1="205"
        y1="355"
        x2="205"
        y2="355"
        stroke="#8B5CF6"
        strokeWidth="1"
        opacity="0.4"
      />
      <motion.path
        d="M70 340 C140 400 270 400 340 340"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="1.2"
        strokeDasharray="4 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.6, delay: 1.6 }}
      />

      <motion.line
        x1="200"
        y1="0"
        x2="200"
        y2="24"
        stroke="#D4F08C"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />

      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="#D4F08C"
          strokeWidth={2.2 - i * 0.15}
          strokeLinecap="round"
          strokeOpacity={0.75}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 + i * 0.18, ease: "easeOut" }}
        />
      ))}

      {nodes.map((n, i) => (
        <g key={projects[i]?.slug ?? i}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="26"
            fill="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.4 }}
          />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="6.5"
            fill="#8B5CF6"
            stroke="#D4F08C"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 + i * 0.2 }}
          />
        </g>
      ))}
    </svg>
  );
}
