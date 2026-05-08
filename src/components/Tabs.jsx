export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs-wrapper">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? "tab-button active" : "tab-button"}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
}