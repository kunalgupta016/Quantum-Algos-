import { useState, useEffect } from "react";
import { getNews, createNews, updateNews, deleteNews } from "../../services/api";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

export default function AdminNewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", source: "", date: "", tag: "", excerpt: "", content: "", isFeatured: false
  });

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const data = await getNews();
      setNews(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load news");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      source: item.source,
      date: item.date,
      tag: item.tag,
      excerpt: item.excerpt,
      content: item.content || "",
      isFeatured: item.isFeatured
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ title: "", source: "", date: "", tag: "", excerpt: "", content: "", isFeatured: false });
  }

  function handleUseTemplate() {
    setFormData(prev => ({
      ...prev,
      content: `<h2>Breaking Quantum Development</h2>
<p>Today, researchers announced a significant breakthrough in the field of quantum computing...</p>
<h3>Key Highlights</h3>
<ul>
  <li>First major highlight</li>
  <li>Second major highlight</li>
</ul>
<p>This development paves the way for future innovations in <strong>quantum error correction</strong>.</p>`
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    const requiredFields = [
      { key: 'title', label: 'Title' },
      { key: 'source', label: 'Source' },
      { key: 'date', label: 'Date' },
      { key: 'tag', label: 'Tag' },
      { key: 'excerpt', label: 'Excerpt' },
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
        await updateNews(editingId, formData);
        alert("News updated successfully");
      } else {
        await createNews(formData);
        alert("News created successfully");
      }
      handleCancel();
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Failed to save news");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      await deleteNews(id);
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Failed to delete news");
    }
  }

  if (loading) return <div className="p-10 text-[var(--color-app-text-main)]">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-app-base)] p-8" data-lenis-prevent="true">
      <div className="max-w-5xl mx-auto text-[var(--color-app-text-main)]">
        <h1 className="text-2xl font-bold mb-8">📰 Manage News</h1>

        <div className="bg-[var(--color-app-surface)] p-6 rounded-xl border border-[var(--color-app-border)] mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editingId ? "Edit News Article" : "Add New Article"}</h2>
            {!editingId && (
              <button 
                type="button" 
                onClick={handleUseTemplate}
                className="px-3 py-1 bg-[var(--color-app-primary)]/10 text-[var(--color-app-primary)] text-sm font-semibold rounded hover:bg-[var(--color-app-primary)]/20 transition-colors"
              >
                + Start with Template
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" placeholder="Title" required
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
            />
            <div className="flex gap-4">
              <input 
                type="text" placeholder="Source (e.g. Nature)" required
                value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
              <input 
                type="text" placeholder="Date (e.g. Jun 2026)" required
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
              <input 
                type="text" placeholder="Tag (e.g. Hardware)" required
                value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}
                className="flex-1 p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
              />
            </div>
            <textarea 
              placeholder="Excerpt (Short summary)" required rows="2"
              value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})}
              className="p-3 bg-[var(--color-app-base)] border border-[var(--color-app-border)] rounded text-sm outline-none text-[var(--color-app-text-main)]"
            />
            
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--color-app-text-muted)] font-bold ml-2">Content Editor</span>
              <RichTextEditor 
                key={editingId || 'new_news'}
                value={formData.content} 
                onChange={val => setFormData(prev => ({...prev, content: val}))} 
                placeholder="Write your news article here..."
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--color-app-text-muted)] cursor-pointer mt-2">
              <input 
                type="checkbox" 
                checked={formData.isFeatured} 
                onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
              />
              Is Featured? (Shows at top of news page)
            </label>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="bg-[var(--color-app-primary)] text-white px-6 py-2 rounded font-bold text-sm">
                {editingId ? "Update News" : "Add News"}
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
          {news.map(item => (
            <div key={item._id} className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[var(--color-app-text-main)]">
                  {item.isFeatured && <span className="text-orange-400 mr-2">★</span>}
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--color-app-text-muted)] mt-1">{item.tag} • {item.source} • {item.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
