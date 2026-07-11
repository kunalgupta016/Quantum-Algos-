import { useState, useEffect } from "react";
import { getDocs, createDoc, updateDoc, deleteDoc } from "../../services/api";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

export default function AdminDocsManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    section: "", title: "", content: ""
  });

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
      title: item.title,
      content: item.content
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ section: "", title: "", content: "" });
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

  if (loading) return <div className="p-10 text-[var(--color-app-text-main)]">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-app-base)] p-8" data-lenis-prevent="true">
      <div className="max-w-5xl mx-auto text-[var(--color-app-text-main)]">
        <h1 className="text-2xl font-bold mb-8">📚 Manage Docs</h1>

        <div className="bg-[var(--color-app-surface)] p-6 rounded-xl border border-[var(--color-app-border)] mb-8">
          <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Document" : "Add New Document"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input 
                type="text" placeholder="Section (e.g. Getting Started)" required
                value={formData.section} onChange={e => setFormData(prev => ({...prev, section: e.target.value}))}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
              <input 
                type="text" placeholder="Title (e.g. Installation)" required
                value={formData.title} onChange={e => setFormData(prev => ({...prev, title: e.target.value}))}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--color-app-text-muted)] font-bold ml-2">Content Editor</span>
              <RichTextEditor 
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

        <div className="flex flex-col gap-3">
          {docs.map(item => (
            <div key={item._id} className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[var(--color-app-text-main)]">{item.title}</h3>
                <p className="text-xs text-[var(--color-app-text-muted)] mt-1">{item.section}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
