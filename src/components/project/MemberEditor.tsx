import type { FormEvent } from 'react';
import { useState } from 'react';
import type { NewMember } from '../../types';

type MemberEditorProps = {
  onAddMember: (member: NewMember) => void;
};

export default function MemberEditor({ onAddMember }: MemberEditorProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAddMember({ name: name.trim(), role: role.trim() || '팀원' });
    setName('');
    setRole('');
  };
  return <form className="member-editor" onSubmit={submit}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="팀원 이름" /><input value={role} onChange={(event) => setRole(event.target.value)} placeholder="역할" /><button>팀원 추가</button></form>;
}
