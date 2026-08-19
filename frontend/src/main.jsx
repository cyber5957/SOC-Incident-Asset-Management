import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Archive,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleAlert,
  ClipboardList,
  Database,
  FileJson,
  Laptop,
  Layers3,
  Menu,
  Network,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  SlidersHorizontal,
  UserRound,
  Wifi,
  X
} from 'lucide-react';
import laptopRecords from '../../asset1/Laptop_assets.json';
import serverRecords from '../../asset1/server_Assets.json';
import firewallRecords from '../../asset1/firewall_Assets.json';
import './styles.css';

const assetTypes = ['Laptop', 'Server', 'Firewall'];
const statusFilters = ['All statuses', 'Live', 'Deployed', 'Offline', 'Review'];
const jsonSources = [
  ['Laptop_assets.json', 'Laptop', laptopRecords],
  ['server_Assets.json', 'Server', serverRecords],
  ['firewall_Assets.json', 'Firewall', firewallRecords]
];

const sourceAssets = jsonSources.flatMap(([source, type, records]) => (
  Array.isArray(records) ? records.map((record) => ({ ...record, type, source })) : []
));

const typeMeta = {
  Laptop: {
    icon: Laptop,
    label: 'Endpoint asset',
    tone: 'mint',
    fields: [
      ['operating_system', 'Operating system'],
      ['ram', 'Memory', 'GB'],
      ['storage', 'Storage', 'GB']
    ]
  },
  Server: {
    icon: Server,
    label: 'Server infrastructure',
    tone: 'blue',
    fields: [
      ['operating_system', 'Operating system'],
      ['ram', 'Memory', 'GB'],
      ['cpu_cores', 'CPU cores'],
      ['server_role', 'Server role']
    ]
  },
  Firewall: {
    icon: Shield,
    label: 'Perimeter control',
    tone: 'coral',
    fields: [
      ['vendor', 'Vendor'],
      ['model', 'Model'],
      ['firmware_version', 'Firmware version']
    ]
  }
};

const statusCopy = {
  live: 'Live',
  deployed: 'Deployed',
  offline: 'Offline',
  review: 'Review'
};

const blankForm = {
  asset_id: '',
  hostname: '',
  ip_address: '',
  owner: '',
  status: 'live',
  operating_system: '',
  ram: '',
  storage: '',
  cpu_cores: '',
  server_role: '',
  vendor: '',
  model: '',
  firmware_version: ''
};

function loadAssets() {
  try {
    const saved = JSON.parse(localStorage.getItem('soc-assets-session'));
    return Array.isArray(saved) ? [...sourceAssets, ...saved] : sourceAssets;
  } catch {
    return sourceAssets;
  }
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function formatValue(value, suffix) {
  if (!value) return 'Not recorded';
  return suffix ? `${value} ${suffix}` : value;
}

function App() {
  const [assets, setAssets] = useState(loadAssets);
  const [activeType, setActiveType] = useState('All assets');
  const [activeStatus, setActiveStatus] = useState('All statuses');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [lastSync] = useState(() => new Date());

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 160);
    return () => window.clearTimeout(id);
  }, [query]);

  const countsByType = useMemo(() => Object.fromEntries(
    assetTypes.map((type) => [type, assets.filter((asset) => asset.type === type).length])
  ), [assets]);

  const visibleAssets = useMemo(() => assets.filter((asset) => {
    const matchesType = activeType === 'All assets' || asset.type === activeType;
    const matchesStatus = activeStatus === 'All statuses' || normalize(asset.status) === normalize(activeStatus);
    const searchable = Object.values(asset).join(' ');
    return matchesType && matchesStatus && normalize(searchable).includes(normalize(debouncedQuery));
  }), [assets, activeType, activeStatus, debouncedQuery]);

  const counts = useMemo(() => {
    const monitoredStatuses = ['live', 'deployed'];
    return {
      total: assets.length,
      monitored: assets.filter((asset) => monitoredStatuses.includes(normalize(asset.status))).length,
      servers: countsByType.Server || 0,
      attention: assets.filter((asset) => !monitoredStatuses.includes(normalize(asset.status))).length
    };
  }, [assets, countsByType]);

  const syncTime = useMemo(() => lastSync.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }), [lastSync]);

  function addAsset(form) {
    const sessionAsset = { ...form, asset_id: form.asset_id || String(Date.now()).slice(-4), source: 'browser session' };
    const saved = JSON.parse(localStorage.getItem('soc-assets-session') || '[]');
    const nextSessionAssets = Array.isArray(saved) ? [...saved, sessionAsset] : [sessionAsset];
    const next = [...sourceAssets, ...nextSessionAssets];
    setAssets(next);
    localStorage.setItem('soc-assets-session', JSON.stringify(nextSessionAssets));
    setShowForm(false);
    setNotice(`${form.type} asset added to this browser session`);
    window.setTimeout(() => setNotice(''), 3200);
  }

  return (
    <div className="app-shell">
      <button
        className="mobile-menu"
        type="button"
        aria-label="Open navigation"
        onClick={() => setIsNavOpen(true)}
      >
        <Menu size={19} />
      </button>
      <Sidebar counts={counts} isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <main className="main-content">
        <Topbar
          syncTime={syncTime}
          showFilters={showFilters}
          onRegister={() => setShowForm(true)}
          onToggleFilters={() => setShowFilters((current) => !current)}
        />
        <DashboardHeader syncTime={syncTime} />
        <section className="metrics" aria-label="Asset statistics">
          <Metric label="Protected assets" value={counts.total} detail="Known defensive surface" icon={<Layers3 size={18} />} tone="dark" />
          <Metric label="Monitored coverage" value={counts.monitored} detail="Live or deployed controls" icon={<Check size={18} />} tone="mint" />
          <Metric label="Critical infrastructure" value={counts.servers} detail="Server fleet in scope" icon={<Server size={18} />} tone="blue" />
          <Metric label="Needs triage" value={counts.attention} detail="Status review required" icon={<CircleAlert size={18} />} tone="coral" />
        </section>
        <InventoryPanel
          assets={assets}
          activeType={activeType}
          activeStatus={activeStatus}
          countsByType={countsByType}
          query={query}
          resultCount={visibleAssets.length}
          showFilters={showFilters}
          visibleAssets={visibleAssets}
          onChangeStatus={setActiveStatus}
          onChangeType={setActiveType}
          onClearSearch={() => setQuery('')}
          onOpenAsset={setSelectedAsset}
          onQuery={setQuery}
          onRegister={() => setShowForm(true)}
        />
        <DataSourceStrip assets={assets} />
        <OperationalPanels assetCount={assets.length} attentionCount={counts.attention} />
        <footer className="footer-note">
          <span><span className="pulse" /> Blue team workspace active</span>
          <span>Python CLI remains the source of truth <ArrowUpRight size={14} /></span>
        </footer>
        {notice && <div className="toast" role="status"><Check size={16} /> {notice}</div>}
        {showForm && <AssetForm onClose={() => setShowForm(false)} onSubmit={addAsset} />}
        {selectedAsset && <AssetProfile asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}
      </main>
    </div>
  );
}

function Sidebar({ counts, isOpen, onClose }) {
  return (
    <>
      <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-mobile-head">
          <Brand />
          <button className="icon-btn ghost" type="button" aria-label="Close navigation" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="desktop-brand"><Brand /></div>
        <div className="workspace-label">WORKSPACE <ChevronDown size={13} /></div>
        <div className="workspace">Blue Team / Northstar <span>BT</span></div>
        <nav aria-label="Primary navigation">
          <button className="nav-item active" type="button"><Layers3 size={17} /> Defensive assets <span className="nav-count">{counts.total}</span></button>
          <button className="nav-item" type="button"><CircleAlert size={17} /> Detection queue <span className="nav-count">0</span></button>
          <button className="nav-item" type="button"><Archive size={17} /> Response log</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="status-line"><span className="pulse" /> Defensive controls operational</div>
          <div className="profile">
            <div className="avatar" aria-hidden="true">VK</div>
            <div><strong>Vinayak</strong><small>Blue team administrator</small></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>
      {isOpen && <button className="nav-scrim" type="button" aria-label="Close navigation overlay" onClick={onClose} />}
    </>
  );
}

function Brand() {
  return <div className="brand"><div className="brand-mark"><Activity size={19} /></div><span>sentinel<span className="brand-dot">.</span>ops</span></div>;
}

function Topbar({ syncTime, showFilters, onRegister, onToggleFilters }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">Blue team <span>/</span> <strong>Defensive inventory</strong></div>
      <div className="top-actions">
        <span className="sync-label"><span className="pulse" /> Local telemetry synced <small>Last sync: {syncTime}</small></span>
        <button
          className={showFilters ? 'icon-btn active' : 'icon-btn'}
          type="button"
          title="Filter view"
          aria-label="Filter view"
          aria-expanded={showFilters}
          onClick={onToggleFilters}
        >
          <SlidersHorizontal size={18} />
        </button>
        <button className="new-button" type="button" onClick={onRegister}><Plus size={17} /> Register asset</button>
      </div>
    </header>
  );
}

function DashboardHeader({ syncTime }) {
  return (
    <section className="page-heading">
      <div>
        <p className="eyebrow">BLUE TEAM OPERATIONS</p>
        <h1>Defensive asset inventory</h1>
        <p className="subheading">Maintain visibility across endpoints, servers, and perimeter controls before alerts become incidents.</p>
      </div>
      <div className="heading-sync">
        <span className="pulse" />
        <div><strong>Local telemetry synced</strong><span>Last sync: {syncTime}</span></div>
      </div>
    </section>
  );
}

function Metric({ label, value, detail, icon, tone }) {
  return (
    <article className={`metric ${tone}`} tabIndex="0">
      <div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function InventoryPanel(props) {
  const {
    assets,
    activeStatus,
    activeType,
    countsByType,
    query,
    resultCount,
    showFilters,
    visibleAssets,
    onChangeStatus,
    onChangeType,
    onClearSearch,
    onOpenAsset,
    onQuery,
    onRegister
  } = props;

  const allTabs = ['All assets', ...assetTypes];
  const hasSearch = query.trim().length > 0;

  return (
    <section className="inventory-panel">
      <div className="panel-toolbar">
        <div>
          <h2>Defensive coverage</h2>
          <span className="result-count">{resultCount} {resultCount === 1 ? 'result' : 'results'} in current view</span>
        </div>
        <div className="toolbar-controls">
          <label className="search-box">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search assets</span>
            <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search assets..." />
            {hasSearch && (
              <button type="button" onClick={onClearSearch} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </label>
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Asset type filters">
        {allTabs.map((tab) => {
          const count = tab === 'All assets' ? assets.length : countsByType[tab] || 0;
          return (
            <button
              key={tab}
              className={activeType === tab ? 'tab active' : 'tab'}
              type="button"
              role="tab"
              aria-selected={activeType === tab}
              onClick={() => onChangeType(tab)}
            >
              {tab}<span>{count}</span>
            </button>
          );
        })}
      </div>
      {showFilters && (
        <div className="filter-drawer" role="region" aria-label="Status filters">
          <div>
            <strong>Asset status</strong>
            <span>Filters use the current asset records only.</span>
          </div>
          <div className="filter-pills">
            {statusFilters.map((status) => (
              <button
                key={status}
                className={activeStatus === status ? 'filter-pill active' : 'filter-pill'}
                type="button"
                aria-pressed={activeStatus === status}
                onClick={() => onChangeStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
      <AssetTable assets={visibleAssets} hasSearch={hasSearch} onOpenAsset={onOpenAsset} onRegister={onRegister} />
    </section>
  );
}

function AssetTable({ assets, hasSearch, onOpenAsset, onRegister }) {
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={hasSearch ? Search : Database}
        title={hasSearch ? 'No assets found' : 'No assets registered'}
        copy={hasSearch ? 'Try hostname, owner, IP address, or asset ID.' : 'Your defensive inventory is currently empty.'}
        action={!hasSearch ? <button className="new-button" type="button" onClick={onRegister}><Plus size={17} /> Register first asset</button> : null}
      />
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Network address</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Profile</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => <AssetRow key={`${asset.type}-${asset.hostname}-${asset.asset_id}-${index}`} asset={asset} onOpenAsset={onOpenAsset} />)}
          </tbody>
        </table>
      </div>
      <div className="asset-card-list">
        {assets.map((asset, index) => <AssetCard key={`${asset.type}-card-${asset.hostname}-${asset.asset_id}-${index}`} asset={asset} onOpenAsset={onOpenAsset} />)}
      </div>
    </>
  );
}

function AssetRow({ asset, onOpenAsset }) {
  const meta = typeMeta[asset.type] || typeMeta.Laptop;
  const Icon = meta.icon;

  return (
    <tr>
      <td>
        <div className="asset-name">
          <span className={`asset-icon ${meta.tone}`} aria-hidden="true" title={meta.label}><Icon size={17} /></span>
          <div><strong>{asset.hostname}</strong><small>{asset.type} <span>#{asset.asset_id}</span> · {asset.source || 'browser session'}</small></div>
        </div>
      </td>
      <td className="mono">{asset.ip_address}</td>
      <td>{asset.owner}</td>
      <td><StatusBadge status={asset.status} /></td>
      <td><span className="profile-value">{profileSummary(asset)}</span><small className="profile-source">{typeMeta[asset.type]?.label}</small></td>
      <td><button className="row-action" type="button" title={`Open ${asset.hostname} profile`} aria-label={`Open ${asset.hostname} profile`} onClick={() => onOpenAsset(asset)}><ArrowUpRight size={16} /></button></td>
    </tr>
  );
}

function AssetCard({ asset, onOpenAsset }) {
  const meta = typeMeta[asset.type] || typeMeta.Laptop;
  const Icon = meta.icon;

  return (
    <article className="asset-card">
      <div className="asset-card-head">
        <span className={`asset-icon ${meta.tone}`} aria-hidden="true" title={meta.label}><Icon size={17} /></span>
        <div><strong>{asset.hostname}</strong><small>{asset.type} #{asset.asset_id} · {asset.source || 'browser session'}</small></div>
        <StatusBadge status={asset.status} />
      </div>
      <dl>
        <div><dt>Network</dt><dd>{asset.ip_address}</dd></div>
        <div><dt>Owner</dt><dd>{asset.owner}</dd></div>
        <div><dt>Profile</dt><dd>{profileSummary(asset)}</dd></div>
      </dl>
      <button className="secondary-button" type="button" onClick={() => onOpenAsset(asset)}>Open profile <ArrowUpRight size={15} /></button>
    </article>
  );
}

function StatusBadge({ status }) {
  const value = normalize(status) || 'review';
  return <span className={`status ${value}`}><span />{statusCopy[value] || status}</span>;
}

function profileSummary(asset) {
  if (asset.type === 'Laptop') return `${formatValue(asset.ram, 'GB')} / ${formatValue(asset.storage, 'GB')}`;
  if (asset.type === 'Server') return `${formatValue(asset.cpu_cores, 'cores')} / ${formatValue(asset.ram, 'GB')}`;
  if (asset.type === 'Firewall') return `${formatValue(asset.vendor)} ${formatValue(asset.model)}`;
  return 'Profile available';
}

function EmptyState({ icon: Icon, title, copy, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={22} /></div>
      <h3>{title}</h3>
      <p>{copy}</p>
      {action}
    </div>
  );
}

function DataSourceStrip({ assets }) {
  const sessionCount = assets.filter((asset) => asset.source === 'browser session').length;

  return (
    <section className="source-strip" aria-label="Asset data sources">
      <div><FileJson size={17} /><strong>JSON inventory source</strong><span>{sourceAssets.length} records loaded from asset1</span></div>
      <div><Database size={17} /><strong>Session additions</strong><span>{sessionCount} browser-session records</span></div>
      <div><RefreshCw size={17} /><strong>Backend status</strong><span>Python CLI unchanged</span></div>
    </section>
  );
}

function OperationalPanels({ assetCount, attentionCount }) {
  return (
    <section className="ops-grid" aria-label="Operational queues">
      <div className="ops-panel">
        <div className="ops-head"><CircleAlert size={17} /><h2>Detection queue</h2></div>
        <div className="readiness-row">
          <span><Wifi size={14} /> {assetCount} assets in scope</span>
          <span>{attentionCount} need triage</span>
        </div>
        <EmptyState icon={ClipboardList} title="No detection events" copy="No active detections currently require attention." />
      </div>
      <div className="ops-panel">
        <div className="ops-head"><Archive size={17} /><h2>Response log</h2></div>
        <div className="readiness-row">
          <span><Database size={14} /> Inventory visible</span>
          <span>Events not connected</span>
        </div>
        <EmptyState icon={Archive} title="No response entries" copy="Response activity will appear here when backend event data is available." />
      </div>
    </section>
  );
}

function AssetForm({ onClose, onSubmit }) {
  const [type, setType] = useState('Laptop');
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const TypeIcon = typeMeta[type].icon;

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    ['hostname', 'ip_address', 'owner'].forEach((key) => {
      if (!form[key].trim()) nextErrors[key] = 'Required';
    });
    if (form.ip_address && !/^[\w:. -]+$/.test(form.ip_address)) nextErrors.ip_address = 'Check address';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit({ ...form, type });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="register-asset-title" onSubmit={submit}>
        <div className="modal-head">
          <div><p className="eyebrow">NEW RECORD</p><h2 id="register-asset-title">Register an asset</h2></div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close" aria-label="Close register asset form"><X size={18} /></button>
        </div>
        <div className="form-step"><span>1</span><strong>Select asset type</strong></div>
        <div className="type-picker">
          {assetTypes.map((item) => {
            const Icon = typeMeta[item].icon;
            return (
              <button type="button" key={item} className={type === item ? 'type-choice active' : 'type-choice'} onClick={() => setType(item)}>
                <Icon size={17} /> {item}
              </button>
            );
          })}
        </div>
        <div className="form-step"><span>2</span><strong>{type} details</strong><small><TypeIcon size={15} /> {typeMeta[type].label}</small></div>
        <div className="form-grid">
          <Field label="Asset ID" value={form.asset_id} onChange={(value) => update('asset_id', value)} />
          <Field label="Hostname" required error={errors.hostname} value={form.hostname} onChange={(value) => update('hostname', value)} />
          <Field label="IP address" required error={errors.ip_address} value={form.ip_address} onChange={(value) => update('ip_address', value)} />
          <Field label="Owner" required error={errors.owner} value={form.owner} onChange={(value) => update('owner', value)} />
          <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="live">Live</option><option value="deployed">Deployed</option><option value="offline">Offline</option><option value="review">Review</option></select></label>
          {type !== 'Firewall' && <Field label="Operating system" value={form.operating_system} onChange={(value) => update('operating_system', value)} />}
          {type === 'Laptop' && (
            <>
              <Field label="RAM" suffix="GB" value={form.ram} onChange={(value) => update('ram', value)} />
              <Field label="Storage" suffix="GB" value={form.storage} onChange={(value) => update('storage', value)} />
            </>
          )}
          {type === 'Server' && (
            <>
              <Field label="RAM" suffix="GB" value={form.ram} onChange={(value) => update('ram', value)} />
              <Field label="CPU cores" value={form.cpu_cores} onChange={(value) => update('cpu_cores', value)} />
              <Field label="Server role" value={form.server_role} onChange={(value) => update('server_role', value)} />
            </>
          )}
          {type === 'Firewall' && (
            <>
              <Field label="Vendor" value={form.vendor} onChange={(value) => update('vendor', value)} />
              <Field label="Model" value={form.model} onChange={(value) => update('model', value)} />
              <Field label="Firmware version" value={form.firmware_version} onChange={(value) => update('firmware_version', value)} />
            </>
          )}
        </div>
        <p className="integration-note">Frontend validation covers obvious input mistakes. The existing Python backend remains authoritative for saved project records.</p>
        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="new-button" type="submit"><Plus size={17} /> Add to inventory</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, error, required, suffix }) {
  const id = label.toLowerCase().replaceAll(' ', '-');
  return (
    <label htmlFor={id}>
      <span>{label}{required && <em>required</em>}{error && <em className="error">{error}</em>}</span>
      <div className={suffix ? 'input-with-suffix' : ''}>
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} required={required} />
        {suffix && <small>{suffix}</small>}
      </div>
    </label>
  );
}

function AssetProfile({ asset, onClose }) {
  const meta = typeMeta[asset.type] || typeMeta.Laptop;
  const Icon = meta.icon;
  const editableFields = ['hostname', 'ip_address', 'owner', 'status', ...meta.fields.map(([key]) => key)];

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="asset-profile-title">
        <div className="modal-head">
          <div className="profile-title">
            <span className={`asset-icon ${meta.tone}`} aria-hidden="true"><Icon size={20} /></span>
            <div><p className="eyebrow">{meta.label.toUpperCase()}</p><h2 id="asset-profile-title">{asset.hostname}</h2></div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close" aria-label="Close asset profile"><X size={18} /></button>
        </div>
        <div className="profile-summary">
          <ProfileItem icon={Database} label="Asset ID" value={`#${asset.asset_id}`} />
          <ProfileItem icon={Layers3} label="Asset type" value={asset.type} />
          <ProfileItem icon={Network} label="Network" value={asset.ip_address} />
          <ProfileItem icon={UserRound} label="Owner" value={asset.owner} />
          <ProfileItem icon={Activity} label="Status" value={<StatusBadge status={asset.status} />} />
        </div>
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Type-specific information</h3>
            <span><FileJson size={14} /> {asset.source || 'browser session'}</span>
          </div>
          <div className="detail-grid">
            {meta.fields.map(([key, label, suffix]) => <Detail key={key} label={label} value={formatValue(asset[key], suffix)} />)}
          </div>
        </div>
        <div className="profile-section update-preview">
          <h3>Edit asset</h3>
          <p>Prepared for the upcoming backend update flow. Saving is intentionally disabled until the Python update path is connected.</p>
          <div className="edit-grid">
            <label>Select attribute<select disabled>{editableFields.map((field) => <option key={field}>{field.replaceAll('_', ' ')}</option>)}</select></label>
            <label>New value<input disabled placeholder="Backend integration pending" /></label>
            <button className="secondary-button" type="button" disabled>Save changes</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value }) {
  return <div className="profile-item"><Icon size={16} /><span>{label}</span><strong>{value}</strong></div>;
}

function Detail({ label, value }) {
  return <div className="detail"><span>{label}</span><strong>{value}</strong></div>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
