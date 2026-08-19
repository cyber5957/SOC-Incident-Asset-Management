import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Shield,
  Server,
  Laptop,
  Search,
  Plus,
  PencilLine,
  Eye,
  LogOut,
  Database,
  LayoutDashboard,
} from 'lucide-react';
import { seedAssets } from './data/seedAssets';

const STORAGE_KEY = 'soc-asset-dashboard-v1';
const AUTHORIZED = ['admin', 'soc manager'];

const assetFields = {
  Laptop: [
    'asset_id',
    'hostname',
    'ip_address',
    'owner',
    'status',
    'operating_system',
    'ram',
    'storage',
  ],
  Server: [
    'asset_id',
    'hostname',
    'ip_address',
    'owner',
    'status',
    'operating_system',
    'ram',
    'cpu_cores',
    'server_role',
  ],
  Firewall: [
    'asset_id',
    'hostname',
    'ip_address',
    'owner',
    'status',
    'vendor',
    'model',
    'firmware_version',
  ],
};

const assetIcons = {
  Laptop,
  Server,
  Firewall: Shield,
};

const initialDrafts = {
  Laptop: {
    asset_id: '',
    hostname: '',
    ip_address: '',
    owner: '',
    status: 'live',
    operating_system: '',
    ram: '',
    storage: '',
  },
  Server: {
    asset_id: '',
    hostname: '',
    ip_address: '',
    owner: '',
    status: 'deployed',
    operating_system: '',
    ram: '',
    cpu_cores: '',
    server_role: '',
  },
  Firewall: {
    asset_id: '',
    hostname: '',
    ip_address: '',
    owner: '',
    status: 'live',
    vendor: '',
    model: '',
    firmware_version: '',
  },
};

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'register', label: 'Register', icon: Plus },
  { id: 'view', label: 'View Assets', icon: Eye },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'update', label: 'Update', icon: PencilLine },
];

function loadAssets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedAssets;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedAssets;
  } catch {
    return seedAssets;
  }
}

function saveAssets(assets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
}

function inferType(asset) {
  if (asset.type) return asset.type;
  if ('vendor' in asset) return 'Firewall';
  if ('cpu_cores' in asset || 'server_role' in asset) return 'Server';
  return 'Laptop';
}

function typeIcon(type) {
  const Icon = assetIcons[type] || Database;
  return <Icon size={18} />;
}

function fieldLabel(field) {
  return field
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function makeNextId(assets, type) {
  const candidates = assets
    .filter((asset) => inferType(asset) === type)
    .map((asset) => Number.parseInt(asset.asset_id, 10))
    .filter(Number.isFinite);
  const next = candidates.length ? Math.max(...candidates) + 1 : 1;
  return String(next).padStart(3, '0');
}

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <section className="stat-card">
      <div className="stat-top">
        <span className="stat-icon">
          <Icon size={18} />
        </span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-hint">{hint}</div>
    </section>
  );
}

function AssetCard({ asset, onSelect, selected }) {
  const type = inferType(asset);
  return (
    <button
      type="button"
      className={`asset-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(asset)}
    >
      <div className="asset-card-head">
        <span className={`chip chip-${type.toLowerCase()}`}>{typeIcon(type)} {type}</span>
        <span className={`status ${asset.status?.toLowerCase() || 'unknown'}`}>
          {asset.status || 'unknown'}
        </span>
      </div>
      <div className="asset-card-body">
        <strong>{asset.hostname || 'Untitled asset'}</strong>
        <span>{asset.asset_id ? `Asset ID ${asset.asset_id}` : 'No asset ID'}</span>
        <span>{asset.ip_address || 'No IP assigned'}</span>
      </div>
      <div className="asset-card-foot">
        <span>{asset.owner || 'No owner'}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
}

function App() {
  const [assets, setAssets] = useState(() => loadAssets());
  const [authInput, setAuthInput] = useState('admin');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('soc-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedType, setSelectedType] = useState('Laptop');
  const [registerType, setRegisterType] = useState('Laptop');
  const [searchType, setSearchType] = useState('Laptop');
  const [searchField, setSearchField] = useState('hostname');
  const [searchValue, setSearchValue] = useState('');
  const [updateType, setUpdateType] = useState('Laptop');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [draft, setDraft] = useState(initialDrafts.Laptop);
  const [message, setMessage] = useState('');

  const filteredAssets = useMemo(
    () => assets.filter((asset) => inferType(asset) === selectedType),
    [assets, selectedType],
  );

  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    return assets.filter((asset) => {
      if (inferType(asset) !== searchType) return false;
      return String(asset[searchField] ?? '')
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
  }, [assets, searchField, searchType, searchValue]);

  const updateList = useMemo(
    () => assets.filter((asset) => inferType(asset) === updateType),
    [assets, updateType],
  );

  const metrics = useMemo(() => {
    const laptops = assets.filter((asset) => inferType(asset) === 'Laptop').length;
    const servers = assets.filter((asset) => inferType(asset) === 'Server').length;
    const firewalls = assets.filter((asset) => inferType(asset) === 'Firewall').length;
    const live = assets.filter((asset) => String(asset.status).toLowerCase() === 'live').length;
    return { laptops, servers, firewalls, live };
  }, [assets]);

  function toast(nextMessage) {
    setMessage(nextMessage);
    window.clearTimeout(window.__socToastTimer);
    window.__socToastTimer = window.setTimeout(() => setMessage(''), 2800);
  }

  function handleLogin() {
    const normalized = authInput.trim().toLowerCase();
    if (!AUTHORIZED.includes(normalized)) {
      toast('Access denied. Use admin or SOC manager.');
      return;
    }
    const nextUser = {
      name: authInput.trim(),
      role: normalized === 'admin' ? 'Admin' : 'SOC Manager',
    };
    setUser(nextUser);
    localStorage.setItem('soc-user', JSON.stringify(nextUser));
    toast(`Authenticated as ${nextUser.role}.`);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('soc-user');
    toast('Logged out.');
  }

  function updateDraft(nextType, nextAsset) {
    setSelectedAssetId(nextAsset?.asset_id || '');
    setDraft(nextAsset || initialDrafts[nextType]);
  }

  function handleRegister() {
    const nextAsset = {
      type: registerType,
      ...draft,
      asset_id: draft.asset_id || makeNextId(assets, registerType),
    };

    setAssets((current) => {
      const next = [...current, nextAsset];
      saveAssets(next);
      return next;
    });
    setDraft(initialDrafts[registerType]);
    toast(`${registerType} asset added.`);
  }

  function handleUpdate() {
    const next = assets.map((asset) => {
      if (inferType(asset) !== updateType || asset.asset_id !== selectedAssetId) return asset;
      return { ...asset, ...draft, type: updateType };
    });
    setAssets(next);
    saveAssets(next);
    toast(`Asset ${selectedAssetId} updated.`);
  }

  if (!user) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div className="brand-mark">
            <Shield size={22} />
            <span>SOC Asset Command Center</span>
          </div>
          <h1>Operational control for laptops, servers, and firewalls.</h1>
          <p>
            A React frontend shaped around your Python asset workflows, with no edits to
            the logic you already wrote.
          </p>

          <div className="login-box">
            <label htmlFor="auth">Authorization</label>
            <input
              id="auth"
              value={authInput}
              onChange={(event) => setAuthInput(event.target.value)}
              placeholder="Enter admin or SOC manager"
            />
            <button type="button" className="primary" onClick={handleLogin}>
              Enter dashboard
            </button>
          </div>

          {message ? <div className="toast">{message}</div> : null}
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">
            <Shield size={22} />
            <span>SOC Asset Command Center</span>
          </div>
          <div className="sidebar-copy">
            Manage the same asset categories your Python app already understands.
          </div>
        </div>

        <nav className="nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button type="button" className="ghost" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">Security Operations</div>
            <h2>Welcome, {user.role}</h2>
          </div>
          <div className="topbar-meta">
            <span className="pill">
              <BadgeCheck size={16} />
              Authenticated
            </span>
            <span className="pill dark">
              <Database size={16} />
              {assets.length} assets
            </span>
          </div>
        </header>

        {message ? <div className="toast floating">{message}</div> : null}

        {activeTab === 'overview' ? (
          <section className="content-grid">
            <div className="hero-panel">
              <div className="hero-copy">
                <div className="eyebrow">Live inventory</div>
                <h3>Fast view into the SOC asset estate.</h3>
                <p>
                  Track asset ownership, status, and the type-specific fields you already
                  defined in Python.
                </p>
              </div>
              <div className="hero-tiles">
                <StatCard label="Laptops" value={metrics.laptops} hint="Endpoint assets" icon={Laptop} />
                <StatCard label="Servers" value={metrics.servers} hint="Infrastructure nodes" icon={Server} />
                <StatCard label="Firewalls" value={metrics.firewalls} hint="Perimeter devices" icon={Shield} />
                <StatCard label="Live" value={metrics.live} hint="Status: live" icon={Activity} />
              </div>
            </div>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <div className="eyebrow">Recent asset types</div>
                  <h3>Inventory slices</h3>
                </div>
              </div>
              <div className="type-grid">
                {['Laptop', 'Server', 'Firewall'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`type-card ${selectedType === type ? 'selected' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    <div className="type-icon">{typeIcon(type)}</div>
                    <strong>{type}</strong>
                    <span>{assets.filter((asset) => inferType(asset) === type).length} records</span>
                  </button>
                ))}
              </div>
            </section>
          </section>
        ) : null}

        {activeTab === 'register' ? (
          <section className="panel stack">
            <div className="panel-head">
              <div>
                <div className="eyebrow">Register assets</div>
                <h3>Create a new record</h3>
              </div>
              <div className="segmented">
                {['Laptop', 'Server', 'Firewall'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={registerType === type ? 'active' : ''}
                    onClick={() => {
                      setRegisterType(type);
                      setDraft(initialDrafts[type]);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              {assetFields[registerType].map((field) => (
                <label key={field} className="field">
                  <span>{fieldLabel(field)}</span>
                  <input
                    value={draft[field] || ''}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, [field]: event.target.value }))
                    }
                    placeholder={`Enter ${fieldLabel(field).toLowerCase()}`}
                  />
                </label>
              ))}
            </div>

            <button type="button" className="primary wide" onClick={handleRegister}>
              <Plus size={18} />
              Register {registerType}
            </button>
          </section>
        ) : null}

        {activeTab === 'view' ? (
          <section className="panel stack">
            <div className="panel-head">
              <div>
                <div className="eyebrow">View resources</div>
                <h3>Browse by asset type</h3>
              </div>
              <div className="segmented">
                {['Laptop', 'Server', 'Firewall'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={selectedType === type ? 'active' : ''}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="asset-list">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={`${inferType(asset)}-${asset.asset_id}-${asset.hostname}`}
                  asset={asset}
                  onSelect={(next) => {
                    updateDraft(inferType(next), next);
                    setUpdateType(inferType(next));
                    setActiveTab('update');
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'search' ? (
          <section className="panel stack">
            <div className="panel-head">
              <div>
                <div className="eyebrow">Search assets</div>
                <h3>Lookup by attribute</h3>
              </div>
            </div>

            <div className="search-bar">
              <select
                value={searchType}
                onChange={(event) => {
                  setSearchType(event.target.value);
                  setSearchField(assetFields[event.target.value][0]);
                }}
              >
                {['Laptop', 'Server', 'Firewall'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select value={searchField} onChange={(event) => setSearchField(event.target.value)}>
                {assetFields[searchType].map((field) => (
                  <option key={field} value={field}>
                    {fieldLabel(field)}
                  </option>
                ))}
              </select>

              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search value"
              />
            </div>

            <div className="asset-list">
              {searchResults.map((asset) => (
                <AssetCard
                  key={`${inferType(asset)}-${asset.asset_id}-${asset.hostname}`}
                  asset={asset}
                  onSelect={(next) => {
                    updateDraft(inferType(next), next);
                    setUpdateType(inferType(next));
                    setActiveTab('update');
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'update' ? (
          <section className="panel stack">
            <div className="panel-head">
              <div>
                <div className="eyebrow">Update assets</div>
                <h3>Edit an existing record</h3>
              </div>
              <div className="segmented">
                {['Laptop', 'Server', 'Firewall'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={updateType === type ? 'active' : ''}
                    onClick={() => {
                      setUpdateType(type);
                      setSelectedAssetId('');
                      setDraft(initialDrafts[type]);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-bar">
              <select
                value={selectedAssetId}
                onChange={(event) => {
                  const next = updateList.find((asset) => asset.asset_id === event.target.value);
                  setSelectedAssetId(event.target.value);
                  setDraft(next || initialDrafts[updateType]);
                }}
              >
                <option value="">Select asset ID</option>
                {updateList.map((asset) => (
                  <option key={asset.asset_id + asset.hostname} value={asset.asset_id}>
                    {asset.asset_id} - {asset.hostname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              {assetFields[updateType].map((field) => (
                <label key={field} className="field">
                  <span>{fieldLabel(field)}</span>
                  <input
                    value={draft[field] || ''}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, [field]: event.target.value }))
                    }
                    placeholder={`Enter ${fieldLabel(field).toLowerCase()}`}
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              className="primary wide"
              onClick={handleUpdate}
              disabled={!selectedAssetId}
            >
              <PencilLine size={18} />
              Save changes
            </button>
          </section>
        ) : null}

        <footer className="footer">
          <span>Frontend only. Python logic remains untouched.</span>
          <span>Local persistence uses browser storage.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
