const code = `
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.id(1)
qc.measure_all()

from qiskit.visualization import circuit_drawer, plot_histogram
import matplotlib.pyplot as plt
from IPython.display import display

fig1 = circuit_drawer(qc, output='mpl')
display(fig1)
plt.close(fig1)

simulator = Aer.get_backend('aer_simulator')
compiled = transpile(qc, simulator)
job = simulator.run(compiled, shots=1000)
counts = job.result().get_counts()

fig2 = plot_histogram(counts)
display(fig2)
plt.close(fig2)
`;

fetch("http://localhost:8000/api/sandbox/run", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
