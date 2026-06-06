import type { PageId } from '../types';

type TopBarProps = {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
};

const tabs: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'project', label: 'Project' },
  { id: 'member', label: 'Member' },
];

export default function TopBar({ currentPage, onNavigate }: TopBarProps) {
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">Team Flow System</p>
        <h1>팀 프로젝트 관리 웹앱</h1>
      </div>
      <nav className="top-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={currentPage === tab.id ? 'active' : ''} onClick={() => onNavigate(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
