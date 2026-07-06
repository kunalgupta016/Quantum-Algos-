import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BlochSphere3D from "./BlochSphere3D";

const PRESETS = [
  { label: "|0⟩", theta: 0, phi: 0 },
  { label: "|1⟩", theta: Math.PI, phi: 0 },
  { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
  { label: "|−⟩", theta: Math.PI / 2, phi: Math.PI },
  { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: "|-i⟩", theta: Math.PI / 2, phi: (3 * Math.PI) / 2 },
];

const GATES = [
  { id: "X", label: "X (NOT)", color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" },
  { id: "Y", label: "Y", color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" },
  { id: "Z", label: "Z (Phase)", color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" },
  { id: "H", label: "H (Hadamard)", color: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200" },
  { id: "S", label: "S", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200" },
  { id: "T", label: "T", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200" },
];

export default function BlochSphereViewer({ blochData }) {
  const navigate = useNavigate();
  const [theta, setTheta] = useState(blochData?.theta ?? Math.PI / 4);
  const [phi, setPhi] = useState(blochData?.phi ?? Math.PI / 3);

  const handleFullScreen = useCallback(() => {
    navigate(`/blochsphere?theta=${theta}&phi=${phi}`);
  }, [navigate, theta, phi]);

  const handlePreset = useCallback((preset) => {
    setTheta(preset.theta);
    setPhi(preset.phi);
  }, []);

  const applyGate = useCallback((gateId) => {
    // Current state [a, b]
    const a = Math.cos(theta / 2);
    const bR = Math.sin(theta / 2) * Math.cos(phi);
    const bI = Math.sin(theta / 2) * Math.sin(phi);

    let newAR, newAI, newBR, newBI;
    const sq2 = Math.sqrt(2);

    switch (gateId) {
      case "X":
        newAR = bR; newAI = bI;
        newBR = a; newBI = 0;
        break;
      case "Y":
        newAR = bI; newAI = -bR;
        newBR = 0; newBI = a;
        break;
      case "Z":
        newAR = a; newAI = 0;
        newBR = -bR; newBI = -bI;
        break;
      case "H":
        newAR = (a + bR) / sq2; newAI = bI / sq2;
        newBR = (a - bR) / sq2; newBI = -bI / sq2;
        break;
      case "S":
        newAR = a; newAI = 0;
        newBR = -bI; newBI = bR;
        break;
      case "T":
        newAR = a; newAI = 0;
        newBR = (bR - bI) / sq2; newBI = (bR + bI) / sq2;
        break;
      default:
        return;
    }

    // Remove global phase to make alpha strictly real and positive
    let magA = Math.sqrt(newAR * newAR + newAI * newAI);
    let magB = Math.sqrt(newBR * newBR + newBI * newBI);
    
    // Normalize to handle float precision issues
    const norm = Math.sqrt(magA * magA + magB * magB);
    magA /= norm; magB /= norm;

    let finalTheta = 2 * Math.acos(Math.max(0, Math.min(1, magA)));
    let finalPhi = 0;

    if (magA > 1e-6) {
      const phaseA = Math.atan2(newAI, newAR);
      const c = Math.cos(-phaseA);
      const s = Math.sin(-phaseA);
      const adjBR = newBR * c - newBI * s;
      const adjBI = newBR * s + newBI * c;
      finalPhi = Math.atan2(adjBI, adjBR);
    } else {
      finalTheta = Math.PI; // State |1>
    }

    if (finalPhi < 0) finalPhi += 2 * Math.PI;

    setTheta(finalTheta);
    setPhi(finalPhi);
  }, [theta, phi]);

  const { alpha, beta } = useMemo(() => {
    const a = Math.cos(theta / 2);
    const bReal = Math.sin(theta / 2) * Math.cos(phi);
    const bImag = Math.sin(theta / 2) * Math.sin(phi);
    return {
      alpha: a.toFixed(4),
      beta:
        Math.abs(bImag) < 0.0001
          ? bReal.toFixed(4)
          : `${bReal.toFixed(3)} + ${bImag.toFixed(3)}i`,
    };
  }, [theta, phi]);

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15 15 0 010 20M2 12h20" />
          </svg>
          Bloch Sphere
        </h4>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-normal normal-case text-gray-400 hidden sm:inline-block">
            Drag to rotate • Scroll to zoom
          </span>
          <button
            onClick={handleFullScreen}
            className="flex items-center gap-1.5 rounded border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Full Screen
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded border border-gray-200 bg-gray-50">
        <Canvas
          camera={{ position: [3, 2.5, 3], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <BlochSphere3D theta={theta} phi={phi} />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            dampingFactor={0.1}
            enableDamping
          />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="mt-5 space-y-4 max-w-md">
        {/* Theta slider */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600">
              θ (Polar angle)
            </label>
            <span className="font-mono text-xs text-orange-600 font-semibold">
              {theta.toFixed(3)} rad ({((theta * 180) / Math.PI).toFixed(1)}°)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.PI}
            step="0.01"
            value={theta}
            onChange={(e) => setTheta(parseFloat(e.target.value))}
            className="bloch-slider w-full"
          />
          <div className="mt-0.5 flex justify-between text-[9px] text-gray-400 font-mono">
            <span>0 (|0⟩)</span>
            <span>π/2</span>
            <span>π (|1⟩)</span>
          </div>
        </div>

        {/* Phi slider */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600">
              φ (Azimuthal angle)
            </label>
            <span className="font-mono text-xs text-indigo-600 font-semibold">
              {phi.toFixed(3)} rad ({((phi * 180) / Math.PI).toFixed(1)}°)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={2 * Math.PI}
            step="0.01"
            value={phi}
            onChange={(e) => setPhi(parseFloat(e.target.value))}
            className="bloch-slider w-full"
          />
          <div className="mt-0.5 flex justify-between text-[9px] text-gray-400 font-mono">
            <span>0 (|+⟩)</span>
            <span>π</span>
            <span>2π</span>
          </div>
        </div>

        {/* Presets */}
        <div>
          <p className="mb-2 text-xs font-semibold text-gray-600">
            Quick Presets
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                className="rounded border border-gray-300 bg-white px-2 py-1 font-mono text-xs text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantum Gates */}
        <div>
          <p className="mb-2 text-xs font-semibold text-gray-600">
            Apply Quantum Gates
          </p>
          <div className="flex flex-wrap gap-2">
            {GATES.map((gate) => (
              <button
                key={gate.id}
                onClick={() => applyGate(gate.id)}
                className={`rounded border px-2.5 py-1 text-[11px] font-bold shadow-sm transition-transform active:scale-95 ${gate.color}`}
                title={`Apply ${gate.label} gate`}
              >
                {gate.label}
              </button>
            ))}
          </div>
        </div>

        {/* State readout */}
        <div className="rounded border border-gray-200 bg-gray-50 p-3">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
            Qubit State Representation
          </p>
          <p className="font-mono text-xs text-gray-800">
            |ψ⟩ ={" "}
            <span className="text-blue-600 font-bold">{alpha}</span>
            <span className="text-gray-500">|0⟩</span>
            {" + "}
            <span className="text-indigo-600 font-bold">{beta}</span>
            <span className="text-gray-500">|1⟩</span>
          </p>
        </div>
      </div>
    </div>
  );
}
