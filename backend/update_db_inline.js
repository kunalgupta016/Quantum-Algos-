require('mongoose').connect('mongodb+srv://kunalgupta55005_db_user:J0Na81XTbrUvHy2Y@cluster0.qvjyoqx.mongodb.net/QuantumSimulationLab?retryWrites=true&w=majority').then(async () => { 
  const edu = await require('./models/EducationalContent').find(); 
  for (const e of edu) { 
    if (e.geometricProof.includes('<img src="http://localhost:8000/uploads/geometric_proof.png"')) { 
      e.geometricProof = e.geometricProof.replace(
        /<img src="http:\/\/localhost:8000\/uploads\/geometric_proof\.png"[^>]+>/,
        '<img src="http://localhost:8000/uploads/geometric_proof.png" alt="Geometric Proof Diagram" style="float: right; margin-left: 20px; margin-bottom: 15px; border-radius: 8px; max-width: 320px; height: auto; border: 1px solid var(--color-app-border); box-shadow: 0 4px 6px rgba(0,0,0,0.3);" />'
      );
      await e.save(); 
    } 
  } 
  console.log('Done updating DB images with inline styles'); 
  process.exit(0); 
}).catch(console.error);
