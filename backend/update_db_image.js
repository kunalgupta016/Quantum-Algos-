require('mongoose').connect('mongodb+srv://kunalgupta55005_db_user:J0Na81XTbrUvHy2Y@cluster0.qvjyoqx.mongodb.net/QuantumSimulationLab?retryWrites=true&w=majority').then(async () => { 
  const edu = await require('./models/EducationalContent').find(); 
  for (const e of edu) { 
    if (e.geometricProof.includes('<img src="http://localhost:8000/uploads/geometric_proof.png"')) { 
      e.geometricProof = e.geometricProof.replace(
        /<img src="http:\/\/localhost:8000\/uploads\/geometric_proof\.png"[^>]+>/,
        '<img src="http://localhost:8000/uploads/geometric_proof.png" alt="Geometric Proof Diagram" class="float-right ml-6 mb-4 rounded-lg shadow-lg border border-[var(--color-app-border)] max-w-[350px]" style="height: auto;" />'
      );
      await e.save(); 
    } 
  } 
  console.log('Done updating DB images'); 
  process.exit(0); 
}).catch(console.error);
