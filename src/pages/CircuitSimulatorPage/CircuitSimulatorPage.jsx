import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Button from "../../components/Button/Button";

const GATES = [
  { type: "I", label: "I (Spacer)", short: "I", color: "bg-gray-500/20 text-gray-400 border-gray-500 border-dashed" },
  { type: "H", label: "H", short: "H", color: "bg-blue-500/20 text-blue-400 border-blue-500" },
  { type: "X", label: "X", short: "X", color: "bg-red-500/20 text-red-400 border-red-500" },
  { type: "Y", label: "Y", short: "Y", color: "bg-green-500/20 text-green-400 border-green-500" },
  { type: "Z", label: "Z", short: "Z", color: "bg-purple-500/20 text-purple-400 border-purple-500" },
  { type: "S", label: "S", short: "S", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500" },
  { type: "T", label: "T", short: "T", color: "bg-orange-500/20 text-orange-400 border-orange-500" },
  { type: "SX", label: "√X", short: "√X", color: "bg-red-400/20 text-red-300 border-red-400" },
  { type: "SDG", label: "S†", short: "S†", color: "bg-yellow-400/20 text-yellow-300 border-yellow-400" },
  { type: "TDG", label: "T†", short: "T†", color: "bg-orange-400/20 text-orange-300 border-orange-400" },
  { type: "CX", label: "CX", short: "CX", color: "bg-pink-500/20 text-pink-400 border-pink-500" },
  { type: "SWAP", label: "SWAP", short: "SWAP", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500" },
  { type: "M", label: "Measure", short: "M", color: "bg-zinc-700/50 text-white border-zinc-500" },
];

function DraggableGate({ gate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${gate.type}`,
    data: { type: gate.type, label: gate.label, color: gate.color },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`h-12 w-12 flex items-center justify-center rounded-lg border-2 font-bold cursor-grab active:cursor-grabbing shadow-lg ${gate.color}`}
    >
      {gate.label}
    </div>
  );
}

function WireDroppable({ wireIndex, gates, onRemove, onUpdate, numQubits }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `wire-${wireIndex}`,
  });

  return (
    <div className="flex items-center gap-4 w-full h-16 group relative">
      <div className="font-mono text-xs font-bold text-[var(--color-app-text-muted)] w-12">
        q[{wireIndex}]
      </div>
      
      {/* The Droppable Wire Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 h-full relative flex items-center px-4 rounded-lg transition-colors border-2 border-dashed ${
          isOver ? "bg-[var(--color-app-primary)]/10 border-[var(--color-app-primary)]" : "bg-transparent border-transparent hover:border-[var(--color-app-border)]"
        }`}
      >
        {/* The literal wire line */}
        <div className="absolute left-0 right-0 h-[2px] bg-[var(--color-app-border-light)] top-1/2 -translate-y-1/2 -z-10" />

        {/* Gates on the wire */}
        <div className="flex gap-2 relative z-10 overflow-x-auto w-full custom-scrollbar items-center">
          {gates.map((g, i) => (
            <div
              key={i}
              className={`h-12 w-16 shrink-0 flex flex-col items-center justify-center rounded-lg border-2 hover:scale-105 transition-transform relative group/gate ${g.color}`}
            >
              <div 
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover/gate:opacity-100 cursor-pointer z-20"
                onClick={(e) => { e.stopPropagation(); onRemove(wireIndex, i); }}
              >✕</div>
              <span className="font-bold text-sm">{g.short || g.label}</span>
              {(g.type === "CX" || g.type === "SWAP") && (
                <select 
                  className="text-[10px] bg-black/40 mt-0.5 border border-pink-500/50 rounded px-1 outline-none text-pink-400 font-mono cursor-pointer"
                  value={g.target !== undefined ? g.target : ((wireIndex + 1) % numQubits)}
                  onChange={(e) => onUpdate(wireIndex, i, { ...g, target: parseInt(e.target.value) })}
                >
                  {Array.from({ length: numQubits }).map((_, targetIdx) => (
                    targetIdx !== wireIndex && (
                      <option key={targetIdx} value={targetIdx} className="bg-[var(--color-app-surface)]">
                        → q[{targetIdx}]
                      </option>
                    )
                  ))}
                </select>
              )}
            </div>
          ))}
          {gates.length === 0 && !isOver && (
            <div className="text-[10px] text-[var(--color-app-text-muted)] italic opacity-0 group-hover:opacity-100 transition-opacity absolute left-4 pointer-events-none">
              Drag gates here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CircuitSimulatorPage() {
  const [numQubits, setNumQubits] = useState(3);
  const [circuit, setCircuit] = useState({ 0: [], 1: [], 2: [] });
  const [activeDragItem, setActiveDragItem] = useState(null);
  
  const [outputPython, setOutputPython] = useState("");
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDragStart = (event) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    setActiveDragItem(null);
    const { over, active } = event;
    
    if (over && over.id.toString().startsWith("wire-")) {
      const wireIndex = parseInt(over.id.split("-")[1], 10);
      const gateData = active.data.current;
      
      setCircuit((prev) => ({
        ...prev,
        [wireIndex]: [...(prev[wireIndex] || []), gateData],
      }));
    }
  };

  const removeGate = (wireIndex, gateIndex) => {
    setCircuit((prev) => {
      const newWire = [...prev[wireIndex]];
      newWire.splice(gateIndex, 1);
      return { ...prev, [wireIndex]: newWire };
    });
  };

  const updateGate = (wireIndex, gateIndex, newGateData) => {
    setCircuit((prev) => {
      const newWire = [...prev[wireIndex]];
      newWire[gateIndex] = newGateData;
      return { ...prev, [wireIndex]: newWire };
    });
  };

  const handleQubitChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 10) val = 10;
    
    setCircuit((prev) => {
      const fresh = { ...prev };
      // add new wires
      for (let i = 0; i < val; i++) {
        if (!fresh[i]) fresh[i] = [];
      }
      // remove extra wires
      for (let i = val; i < 15; i++) {
        delete fresh[i];
      }
      return fresh;
    });
    setNumQubits(val);
  };

  const clearCircuit = () => {
    const fresh = {};
    for (let i = 0; i < numQubits; i++) fresh[i] = [];
    setCircuit(fresh);
    setSimResult(null);
    setOutputPython("");
  };

  const runSimulation = async () => {
    setLoading(true);
    setSimResult(null);

    // Check if user has explicit 'M' gates
    let hasMeasureGate = false;
    for (let q = 0; q < numQubits; q++) {
      if (circuit[q] && circuit[q].some(g => g.type === "M")) {
        hasMeasureGate = true;
        break;
      }
    }

    // Generate Qiskit Python Code
    let pyCode = `from qiskit import QuantumCircuit, transpile\n`;
    pyCode += `from qiskit_aer import Aer\n`;
    pyCode += `import json\n\n`;
    
    if (hasMeasureGate) {
      pyCode += `qc = QuantumCircuit(${numQubits}, ${numQubits})\n`;
    } else {
      pyCode += `qc = QuantumCircuit(${numQubits})\n`;
    }
    
    // Add gates
    for (let q = 0; q < numQubits; q++) {
      if (circuit[q]) {
        circuit[q].forEach((gate) => {
          if (gate.type === "CX" || gate.type === "SWAP") {
            let target = gate.target !== undefined ? gate.target : ((q + 1) % numQubits);
            if (numQubits > 1) {
                pyCode += `qc.${gate.type.toLowerCase()}(${q}, ${target})\n`;
            } else {
                pyCode += `# ${gate.type.toLowerCase()} skipped (only 1 qubit available)\n`;
            }
          } else if (gate.type === "I") {
            pyCode += `qc.id(${q})\n`;
          } else if (gate.type === "M") {
            pyCode += `qc.measure(${q}, ${q})\n`;
          } else {
            pyCode += `qc.${gate.type.toLowerCase()}(${q})\n`;
          }
        });
      }
    }
    
    if (!hasMeasureGate) {
      pyCode += `\nqc.measure_all()\n`;
    }

    pyCode += `
from qiskit.visualization import circuit_drawer, plot_histogram
import matplotlib.pyplot as plt

fig = circuit_drawer(qc, output='mpl')
display(fig)
plt.close(fig)

simulator = Aer.get_backend('aer_simulator')
compiled = transpile(qc, simulator)
job = simulator.run(compiled, shots=1000)
counts = job.result().get_counts()

fig2 = plot_histogram(counts)
display(fig2)
plt.close(fig2)
`;
    // We would ideally send this code to the /api/sandbox/run endpoint to execute it
    
    try {
      const { runSandboxCode } = await import("../../services/api");
      const data = await runSandboxCode({ code: pyCode });
      setSimResult(data);
    } catch (err) {
      console.error(err);
      setSimResult({ errorText: "Failed to connect to simulation backend." });
    }
    
    setOutputPython(pyCode);
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] w-full flex-col bg-[var(--color-app-base)] text-[var(--color-app-text-main)]">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-[var(--color-app-surface)] px-8 py-4 border-b border-[var(--color-app-border)]">
        <div>
          <h1 className="text-sm font-bold flex items-center gap-3 text-[var(--color-app-text-main)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-app-accent)] to-[var(--color-app-accent-hover)]">
              <svg className="h-4 w-4 text-[var(--color-app-base)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            Drag-and-Drop Circuit Simulator
          </h1>
          <p className="text-xs text-[var(--color-app-text-muted)] mt-1 ml-11">
            Build quantum circuits visually and simulate them on the fly.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={clearCircuit}>Clear</Button>
          <Button variant="primary" loading={loading} onClick={runSimulation}>
            {loading ? "Running..." : "▶ Run Circuit"}
          </Button>
        </div>
      </div>
      <div className="app-gradient-line" />

      <div className="flex flex-1 overflow-hidden">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          
          {/* Left Sidebar: Gate Palette */}
          <div className="w-64 bg-[var(--color-app-surface)] border-r border-[var(--color-app-border)] p-6 overflow-y-auto" data-lenis-prevent="true">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-app-accent)] mb-6 border-b border-[var(--color-app-border)] pb-2">
              Gate Palette
            </h3>
            <p className="text-xs text-[var(--color-app-text-muted)] mb-4">
              Drag gates onto the qubit wires.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {GATES.map((gate) => (
                <DraggableGate key={gate.type} gate={gate} />
              ))}
            </div>
          </div>

          {/* Main Area: Circuit Wire Grid */}
          <div className="flex-1 p-8 overflow-y-auto bg-[var(--color-app-base)] flex flex-col" data-lenis-prevent="true">
            
            {/* Qubit Controls */}
            <div className="flex justify-end gap-2 mb-6 items-center">
              <label className="text-xs font-bold text-[var(--color-app-text-muted)] uppercase tracking-wider">Number of Qubits:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numQubits}
                onChange={handleQubitChange}
                className="w-16 px-2 py-1 text-xs rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface)] text-center outline-none focus:border-[var(--color-app-primary)]"
              />
            </div>

            {/* Wires */}
            <div className="app-glass p-6 rounded-2xl flex flex-col gap-4 border border-[var(--color-app-border)] shadow-xl shadow-[var(--color-app-primary-glow)]/5">
              {Array.from({ length: numQubits }).map((_, i) => (
                <WireDroppable key={i} wireIndex={i} gates={circuit[i] || []} onRemove={removeGate} onUpdate={updateGate} numQubits={numQubits} />
              ))}
            </div>

            {/* Simulation Results */}
            {simResult && (
              <div className="mt-8 animate-fade-in">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-app-primary)] mb-4 border-b border-[var(--color-app-border)] pb-2">
                  Simulation Results
                </h3>
                
                {simResult.errorText ? (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs whitespace-pre-wrap">
                    {simResult.errorText}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {simResult.images && simResult.images.length > 0 && (
                      <div className="app-glass rounded-xl p-4 flex justify-center">
                        <img src={`data:image/png;base64,${simResult.images[0]}`} className="max-h-64 object-contain invert brightness-90 hue-rotate-180" alt="Circuit" />
                      </div>
                    )}
                    {simResult.images && simResult.images.length > 1 && (
                      <div className="app-glass rounded-xl p-4 flex justify-center">
                        <img src={`data:image/png;base64,${simResult.images[1]}`} className="max-h-64 object-contain invert brightness-90 hue-rotate-180" alt="Histogram" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Code Output */}
                {!simResult.errorText && outputPython && (
                  <div className="mt-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-app-text-muted)] mb-4 border-b border-[var(--color-app-border)] pb-2">
                      Generated Qiskit Code
                    </h3>
                    <pre className="bg-[#0D1117] text-[#C9D1D9] p-4 rounded-xl overflow-x-auto text-xs font-mono border border-[var(--color-app-border)] shadow-inner">
                      <code>{outputPython}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
            
          </div>

          <DragOverlay>
            {activeDragItem ? (
              <div className={`h-12 w-12 flex items-center justify-center rounded-lg border-2 font-bold shadow-2xl scale-110 ${activeDragItem.color}`}>
                {activeDragItem.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
