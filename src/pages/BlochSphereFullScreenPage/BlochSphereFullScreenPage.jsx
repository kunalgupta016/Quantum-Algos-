import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BlochSphere3D from "../../components/BlochSphereViewer/BlochSphere3D";

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

export default function BlochSphereFullScreenPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTheta = parseFloat(searchParams.get("theta")) || Math.PI / 4;
  const initialPhi = parseFloat(searchParams.get("phi")) || Math.PI / 3;

  const [theta, setTheta] = useState(initialTheta);
  const [phi, setPhi] = useState(initialPhi);

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
    <div className="flex h-screen w-screen flex-col bg-gray-50 text-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15 15 0 010 20M2 12h20" />
          </svg>
          Bloch Sphere Explorer
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition shadow-sm"
        >
          Close Full Screen
        </button>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left Side: 3D Canvas */}
        <div className="flex-1 relative border-r border-gray-200 bg-white flex items-center justify-center p-8">
          <div className="absolute top-4 left-4 text-xs font-semibold text-gray-400 tracking-wider">
            DRAG TO ROTATE • SCROLL TO ZOOM
          </div>
          <div className="w-full h-full max-w-5xl max-h-5xl">
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
                minDistance={2}
                maxDistance={10}
                dampingFactor={0.1}
                enableDamping
              />
            </Canvas>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="w-full lg:w-96 bg-gray-50 p-6 overflow-y-auto flex flex-col gap-8 shadow-inner border-l border-gray-200">
          
          {/* State readout */}
          <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
              Qubit State
            </p>
            <p className="font-mono text-xl text-gray-800 leading-relaxed">
              |ψ⟩ = <br/>
              <span className="text-blue-600 font-bold">{alpha}</span>
              <span className="text-gray-500">|0⟩</span>
              {" + "}<br/>
              <span className="text-indigo-600 font-bold">{beta}</span>
              <span className="text-gray-500">|1⟩</span>
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-800 text-base uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">Controls</h3>
            
            {/* Theta slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  θ (Polar angle)
                </label>
                <span className="font-mono text-sm text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
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
                className="bloch-slider w-full mt-2"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-400 font-mono">
                <span>0 (|0⟩)</span>
                <span>π/2</span>
                <span>π (|1⟩)</span>
              </div>
            </div>

            {/* Phi slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  φ (Azimuthal angle)
                </label>
                <span className="font-mono text-sm text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
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
                className="bloch-slider w-full mt-2"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-400 font-mono">
                <span>0 (|+⟩)</span>
                <span>π</span>
                <span>2π</span>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">
              Quick Presets
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className="rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-700 hover:bg-blue-50 transition-colors hover:border-blue-300 hover:text-blue-700 shadow-sm font-bold"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantum Gates */}
          <div>
            <p className="mb-4 mt-6 text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">
              Apply Quantum Gates
            </p>
            <div className="grid grid-cols-2 gap-3">
              {GATES.map((gate) => (
                <button
                  key={gate.id}
                  onClick={() => applyGate(gate.id)}
                  className={`rounded border px-3 py-2 text-sm font-bold shadow-sm transition-transform active:scale-95 ${gate.color}`}
                  title={`Apply ${gate.label} gate`}
                >
                  {gate.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
