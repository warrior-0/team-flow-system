import type { Project } from '../../types';

type MemberPickerProps = {
  project: Project;
  onBack: () => void;
  onSelectMember: (memberId: string) => void;
};

export default function MemberPicker({ project, onBack, onSelectMember }: MemberPickerProps) {
  return <section className="picker-card"><button onClick={onBack}>프로젝트 선택으로</button><p className="eyebrow">Step 2</p><h2>{project.name} 팀원 선택</h2>{project.members.length ? project.members.map((member) => <button key={member.id} onClick={() => onSelectMember(member.id)}>{member.name} · {member.role}</button>) : <p className="muted">등록된 팀원이 없습니다.</p>}</section>;
}
