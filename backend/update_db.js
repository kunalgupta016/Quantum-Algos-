require('mongoose').connect('mongodb+srv://kunalgupta55005_db_user:J0Na81XTbrUvHy2Y@cluster0.qvjyoqx.mongodb.net/QuantumSimulationLab?retryWrites=true&w=majority').then(async () => { 
  const edu = await require('./models/EducationalContent').find(); 
  for (const e of edu) { 
    if (!e.geometricProof.includes('<img')) { 
      e.geometricProof = '<img src="http://localhost:8000/uploads/geometric_proof.png" alt="Geometric Proof Diagram" class="my-4 rounded-lg shadow-lg border border-white/10" style="max-width: 100%; height: auto;" />\n' + e.geometricProof; 
      await e.save(); 
    } 
  } 
  console.log('Done updating DB'); 
  process.exit(0); 
}).catch(console.error);
