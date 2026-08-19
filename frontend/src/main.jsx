import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Archive, ArrowUpRight, Check, ChevronDown, CircleAlert, Laptop,
  Layers3, Plus, Search, Server, Shield, SlidersHorizontal, X
} from 'lucide-react';
import './styles.css';

const seedAssets = [
  { asset_id: '001', hostname: 'kali', ip_address: '192.168.1.1', owner: 'vinayak', status: 'live', operating_system: 'kali', ram: '16', storage: '512', type: 'Laptop' },
  { asset_id: '001', hostname: 'server', ip_address: '192.168.0.1', owner: 'vinayak', status: 'deployed', operating_system: 'cisco', ram: '32', cpu_cores: '56', server_role: 'networking', type: 'Server' },
  { asset_id: '001', hostname: 'vinu', ip_address: '192.168.1.1', owner: 'vinayak', status: 'live', vendor: 'cisco', model: 'catalyst', firmware_version: '68.242', type: 'Firewall' }
];

const typeMeta = {
  Laptop: { icon: Laptop, tone: 'mint' },
  Server: { icon: Server, tone: 'blue' },
  Firewall: { icon: Shield, tone: 'coral' }
};

function loadAssets() {
  try { return JSON.parse(localStorage.getItem('soc-assets')) || seedAssets; }
  catch { return seedAssets; }
}

function App() {
  const [assets, setAssets] = useState(loadAssets);
  const [activeType, setActiveType] = useState('All assets');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');

  const visibleAssets = useMemo(() => assets.filter((asset) => {
    const matchesType = activeType === 'All assets' || asset.type === activeType;
    const searchable = Object.values(asset).join(' ').toLowerCase();
    return matchesType && searchable.includes(query.toLowerCase());
  }), [assets, activeType, query]);

  const counts = useMemo(() => ({
    total: assets.length,
    live: assets.filter((asset) => asset.status === 'live').length,
    servers: assets.filter((asset) => asset.type === 'Server').length,
    attention: assets.filter((asset) => !['live', 'deployed'].includes(asset.status)).length
  }), [assets]);

  function addAsset(form) {
    const next = [...assets, { ...form, asset_id: form.asset_id || String(Date.now()).slice(-4) }];
    setAssets(next);
    localStorage.setItem('soc-assets', JSON.stringify(next));
    setShowForm(false);
    setNotice(`${form.type} asset added to this browser session`);
    window.setTimeout(() => setNotice(''), 3000);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Activity size={19} /></div><span>sentinel<span className="brand-dot">.</span>ops</span></div>
      <div className="workspace-label">WORKSPACE <ChevronDown size={13} /></div>
      <div className="workspace">Northstar SOC <span>NS</span></div>
      <nav>
        <button className="nav-item active"><Layers3 size={17} /> Assets <span className="nav-count">{counts.total}</span></button>
        <button className="nav-item"><CircleAlert size={17} /> Incidents <span className="nav-count">4</span></button>
        <button className="nav-item"><Archive size={17} /> Audit log</button>
      </nav>
      <div className="sidebar-bottom"><div className="status-line"><span className="pulse" /> Systems operational</div><div className="profile"><div className="avatar">VK</div><div><strong>Vinayak</strong><small>Administrator</small></div><ChevronDown size={15} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs">Operations <span>/</span> <strong>Asset inventory</strong></div><div className="top-actions"><span className="sync-label"><span className="pulse" /> Local data synced</span><button className="icon-btn" title="Filter view"><SlidersHorizontal size={18} /></button><button className="new-button" onClick={() => setShowForm(true)}><Plus size={17} /> Register asset</button></div></header>
      <section className="page-heading"><div><p className="eyebrow">SECURITY OPERATIONS CENTER</p><h1>Asset inventory</h1><p className="subheading">A live view of every endpoint, server, and perimeter device in your environment.</p></div><div className="heading-date">19 AUG 2026<br /><span>Last reviewed 09:42 UTC</span></div></section>
      <section className="metrics"><Metric label="Total assets" value={counts.total} detail="Across all asset types" icon={<Layers3 size={18} />} tone="dark" /><Metric label="Live / deployed" value={counts.live + assets.filter(a => a.status === 'deployed').length} detail="Ready and monitored" icon={<Check size={18} />} tone="mint" /><Metric label="Server fleet" value={counts.servers} detail="Compute infrastructure" icon={<Server size={18} />} tone="blue" /><Metric label="Needs attention" value={counts.attention} detail="Review status required" icon={<CircleAlert size={18} />} tone="coral" /></section>
      <section className="inventory-panel"><div className="panel-toolbar"><div><h2>Registered assets</h2><span className="result-count">{visibleAssets.length} records shown</span></div><div className="toolbar-controls"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hostname, owner, IP..." /></div></div></div><div className="tabs">{['All assets', 'Laptop', 'Server', 'Firewall'].map((tab) => <button key={tab} className={activeType === tab ? 'tab active' : 'tab'} onClick={() => setActiveType(tab)}>{tab}{tab !== 'All assets' && <span>{assets.filter(a => a.type === tab).length}</span>}</button>)}</div><AssetTable assets={visibleAssets} /></section>
      <footer className="footer-note"><span><span className="pulse" /> Data persists locally in this browser</span><span>Python CLI remains unchanged <ArrowUpRight size={14} /></span></footer>
      {notice && <div className="toast"><Check size={16} /> {notice}</div>}
      {showForm && <AssetForm onClose={() => setShowForm(false)} onSubmit={addAsset} />}
    </main>
  </div>;
}

function Metric({ label, value, detail, icon, tone }) { return <div className={`metric ${tone}`}><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}</strong><small>{detail}</small></div>; }

function AssetTable({ assets }) { return <div className="table-wrap"><table><thead><tr><th>Asset</th><th>Network address</th><th>Owner</th><th>Status</th><th>Profile</th><th></th></tr></thead><tbody>{assets.map((asset, index) => { const meta = typeMeta[asset.type]; const Icon = meta.icon; return <tr key={`${asset.type}-${asset.hostname}-${index}`}><td><div className="asset-name"><span className={`asset-icon ${meta.tone}`}><Icon size={17} /></span><div><strong>{asset.hostname}</strong><small>{asset.type} <span>#{asset.asset_id}</span></small></div></div></td><td className="mono">{asset.ip_address}</td><td>{asset.owner}</td><td><span className={`status ${asset.status}`}>{asset.status}</span></td><td><span className="profile-value">{asset.type === 'Laptop' ? `${asset.ram} GB / ${asset.storage} GB` : asset.type === 'Server' ? `${asset.cpu_cores} cores / ${asset.ram} GB` : `${asset.vendor} ${asset.model}`}</span></td><td><button className="row-action" title="Open asset"><ArrowUpRight size={16} /></button></td></tr>; })}{assets.length === 0 && <tr><td colSpan="6" className="empty">No assets match this view.</td></tr>}</tbody></table></div>; }

function AssetForm({ onClose, onSubmit }) {
  const [type, setType] = useState('Laptop');
  const [form, setForm] = useState({ asset_id: '', hostname: '', ip_address: '', owner: '', status: 'live', operating_system: '', ram: '', storage: '', cpu_cores: '', server_role: '', vendor: '', model: '', firmware_version: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); onSubmit({ ...form, type }); };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={submit}><div className="modal-head"><div><p className="eyebrow">NEW RECORD</p><h2>Register an asset</h2></div><button type="button" className="icon-btn" onClick={onClose} title="Close"><X size={18} /></button></div><div className="type-picker">{Object.keys(typeMeta).map((item) => <button type="button" key={item} className={type === item ? 'type-choice active' : 'type-choice'} onClick={() => setType(item)}>{item}</button>)}</div><div className="form-grid">{[['hostname','Hostname'],['ip_address','IP address'],['owner','Owner'],['asset_id','Asset ID'],['status','Status'],['operating_system','Operating system']].map(([key, label]) => <label key={key}>{label}<input required={['hostname','ip_address','owner'].includes(key)} value={form[key]} onChange={(event) => update(key, event.target.value)} /></label>)}{type === 'Laptop' && <><label>RAM (GB)<input value={form.ram} onChange={(event) => update('ram', event.target.value)} /></label><label>Storage (GB)<input value={form.storage} onChange={(event) => update('storage', event.target.value)} /></label></>}{type === 'Server' && <><label>CPU cores<input value={form.cpu_cores} onChange={(event) => update('cpu_cores', event.target.value)} /></label><label>Server role<input value={form.server_role} onChange={(event) => update('server_role', event.target.value)} /></label></>}{type === 'Firewall' && <><label>Vendor<input value={form.vendor} onChange={(event) => update('vendor', event.target.value)} /></label><label>Model<input value={form.model} onChange={(event) => update('model', event.target.value)} /></label><label>Firmware version<input value={form.firmware_version} onChange={(event) => update('firmware_version', event.target.value)} /></label></>}</div><div className="modal-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button className="new-button" type="submit"><Plus size={17} /> Add to inventory</button></div></form></div>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
