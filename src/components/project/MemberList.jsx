import MemberCard from './MemberCard';

export default function MemberList({ project, onUpdateMember, onDeleteMember, onOpenMember }) {
  return <div className="member-list"><h3>팀원</h3>{project.members.length ? project.members.map((member) => <MemberCard key={member.id} member={member} onUpdate={onUpdateMember} onDelete={onDeleteMember} onOpen={onOpenMember} />) : <p className="muted">아직 팀원이 없습니다.</p>}</div>;
}
