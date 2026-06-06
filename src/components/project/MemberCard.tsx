import { useState } from 'react';
import type { Member, MemberChanges } from '../../types';

type MemberCardProps = {
  member: Member;
  onUpdate: (memberId: string, changes: MemberChanges) => void;
  onDelete: (memberId: string) => void;
  onOpen: (memberId: string) => void;
};

export default function MemberCard({ member, onUpdate, onDelete, onOpen }: MemberCardProps) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  return <article className="member-card"><button className="link-card" onClick={() => onOpen(member.id)}><strong>{member.name}</strong><span>{member.role}</span></button><input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => onUpdate(member.id, { name })} /><input value={role} onChange={(event) => setRole(event.target.value)} onBlur={() => onUpdate(member.id, { role })} /><button className="danger" onClick={() => onDelete(member.id)}>삭제</button></article>;
}
