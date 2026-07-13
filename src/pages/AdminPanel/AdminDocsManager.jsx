import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import { getDocs, createDoc, updateDoc, deleteDoc, reorderDocs } from "../../services/api";

export default function AdminDocsManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);
  
  const [formData, setFormData] = useState({
    section: "", subsection: "", title: "", content: ""
  });

  const uniqueSections = [...new Set(docs.map(d => d.section))];

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      const data = await getDocs();
      setDocs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load docs");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setFormData({
      section: item.section,
      subsection: item.subsection || "",
      title: item.title,
      content: item.content
    });
  }

  function handleCancel() {
    setEditingId(null);
    setIsAddingNewSection(false);
    setFormData({ section: "", subsection: "", title: "", content: "" });
  }

  function handleUseTemplate() {
    setFormData(prev => ({
      ...prev,
      content: `<h2>Introduction to [Topic]</h2>
<p>This is a brief introduction to what you are explaining. Replace this text with your own explanation.</p>
<h3>Example Scenario</h3>
<p>Here is a practical example:</p>
<pre class="ql-syntax" spellcheck="false"># Paste your Python/Qiskit code here
import qiskit
</pre>
<p><strong>Next Steps:</strong> You can explore more in the next module.</p>`
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    const requiredFields = [
      { key: 'section', label: 'Section' },
      { key: 'title', label: 'Title' },
      { key: 'content', label: 'Content' }
    ];
    for (let field of requiredFields) {
      if (!formData[field.key] || formData[field.key] === '<p><br></p>') {
        alert(`Please fill the required field: ${field.label}`);
        return;
      }
    }

    try {
      if (editingId) {
        await updateDoc(editingId, formData);
        alert("Doc updated successfully");
      } else {
        await createDoc(formData);
        alert("Doc created successfully");
      }
      handleCancel();
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Failed to save doc");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDoc(id);
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete doc");
    }
  }

  async function handleMoveSection(index, direction) {
    const sections = [...uniqueSections];
    if (direction === -1 && index > 0) {
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
    } else if (direction === 1 && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    } else {
      return;
    }
    await saveNewOrder(sections, docs);
  }

  async function handleMoveModule(section, index, direction) {
    const sectionDocs = docs.filter(d => d.section === section);
    if (direction === -1 && index > 0) {
      [sectionDocs[index - 1], sectionDocs[index]] = [sectionDocs[index], sectionDocs[index - 1]];
    } else if (direction === 1 && index < sectionDocs.length - 1) {
      [sectionDocs[index], sectionDocs[index + 1]] = [sectionDocs[index + 1], sectionDocs[index]];
    } else {
      return;
    }
    // Reconstruct docs array with new module order
    const otherDocs = docs.filter(d => d.section !== section);
    await saveNewOrder(uniqueSections, [...otherDocs, ...sectionDocs]);
  }

  async function saveNewOrder(sectionsList, allDocs) {
    const updates = [];
    sectionsList.forEach((sec, sIdx) => {
      const sDocs = allDocs.filter(d => d.section === sec);
      sDocs.forEach((d, dIdx) => {
        updates.push({ id: d._id, sectionOrder: sIdx, order: dIdx });
      });
    });
    
    // Optimistic update locally
    setDocs(allDocs); 

    try {
      await reorderDocs(updates);
      fetchDocs();
    } catch (err) {
      console.error("Failed to reorder", err);
      alert("Failed to save new order");
    }
  }

  if (loading) return <div className="p-10 text-[var(--color-app-text-main)]">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-app-base)] p-8" data-lenis-prevent="true">
      <div className="max-w-5xl mx-auto text-[var(--color-app-text-main)]">
        <h1 className="text-2xl font-bold mb-8">📚 Manage Docs</h1>

        <div className="bg-[var(--color-app-surface)] p-6 rounded-xl border border-[var(--color-app-border)] mb-8">
          <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Document" : "Add New Document"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              {isAddingNewSection ? (
                <div className="flex-1 flex gap-2">
                  <input 
                    type="text" placeholder="New Section Name" required
                    value={formData.section} onChange={e => setFormData(prev => ({...prev, section: e.target.value}))}
                    className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
                  />
                  <button type="button" onClick={() => setIsAddingNewSection(false)} className="px-3 bg-[var(--color-app-surface-hover)] text-[var(--color-app-text-muted)] rounded border border-[var(--color-app-border)] text-sm hover:text-white">Cancel</button>
                </div>
              ) : (
                <select 
                  value={formData.section} 
                  onChange={e => {
                    if (e.target.value === '__new__') {
                      setIsAddingNewSection(true);
                      setFormData(prev => ({...prev, section: ""}));
                    } else {
                      setFormData(prev => ({...prev, section: e.target.value}));
                    }
                  }}
                  required
                  className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)] appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a Section</option>
                  {uniqueSections.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                  <option value="__new__">+ Add New Section</option>
                </select>
              )}
              <input 
                type="text" placeholder="Subsection (Optional)"
                value={formData.subsection} onChange={e => setFormData(prev => ({...prev, subsection: e.target.value}))}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
              <input 
                type="text" placeholder="Title (e.g. Installation)" required
                value={formData.title} onChange={e => setFormData(prev => ({...prev, title: e.target.value}))}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
            </div>
            <div className="flex justify-end -mb-2">
              <button type="button" onClick={handleUseTemplate} className="text-xs bg-orange-600/20 text-orange-400 hover:text-orange-300 hover:bg-orange-600/30 px-3 py-1.5 rounded-full border border-orange-600/30 transition flex items-center gap-1">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Start with Template
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--color-app-text-muted)] font-bold ml-2">Content Editor</span>
              <RichTextEditor 
                key={editingId || 'new_doc'}
                value={formData.content} 
                onChange={val => setFormData(prev => ({...prev, content: val}))} 
                placeholder="Write your documentation here... (LaTeX math is supported, just wrap in $$ $$)"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded font-bold text-sm transition">
                {editingId ? "Update Doc" : "Add Doc"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="bg-[var(--color-app-surface-hover)] border border-[var(--color-app-border)] px-6 py-2 rounded font-bold text-sm text-[var(--color-app-text-main)]">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          {uniqueSections.map((section, sIdx) => {
            const sectionDocs = docs.filter(d => d.section === section);
            return (
              <div key={section} className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--color-app-border)]">
                  <h3 className="font-bold text-lg text-[var(--color-app-text-main)] flex items-center gap-2">
                    📁 {section}
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={() => handleMoveSection(sIdx, -1)} disabled={sIdx === 0} className="p-1.5 bg-gray-500/10 text-[var(--color-app-text-muted)] rounded hover:bg-gray-500/20 hover:text-[var(--color-app-text-main)] disabled:opacity-30 transition-colors" title="Move Section Up">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button onClick={() => handleMoveSection(sIdx, 1)} disabled={sIdx === uniqueSections.length - 1} className="p-1.5 bg-gray-500/10 text-[var(--color-app-text-muted)] rounded hover:bg-gray-500/20 hover:text-[var(--color-app-text-main)] disabled:opacity-30 transition-colors" title="Move Section Down">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {sectionDocs.map((item, dIdx) => (
                    <div key={item._id} className="bg-[var(--color-app-base)] border border-[var(--color-app-border-light)] p-3 rounded flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => handleMoveModule(section, dIdx, -1)} disabled={dIdx === 0} className="p-0.5 text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text-main)] disabled:opacity-30 transition-colors" title="Move Module Up">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path></svg>
                          </button>
                          <button onClick={() => handleMoveModule(section, dIdx, 1)} disabled={dIdx === sectionDocs.length - 1} className="p-0.5 text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text-main)] disabled:opacity-30 transition-colors" title="Move Module Down">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[var(--color-app-text-main)]">{item.title}</h4>
                          {item.subsection && <p className="text-xs text-[var(--color-app-text-muted)] mt-0.5">↳ {item.subsection}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
