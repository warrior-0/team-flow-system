import { useState } from 'react';

export default function CreateProjectForm({ onCreateProject }) {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name);
    setName('');
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="새 프로젝트 이름" />
      <button type="submit">프로젝트 생성</button>
    </form>
  );
}
