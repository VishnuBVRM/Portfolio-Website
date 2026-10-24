import React, { useState } from 'react';
import { Github, Edit2, Check, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// GitHub link tab with an edit option. Shows the GitHub button (opens the link)
// and a pencil that lets you change the GitHub link right there.
export const GithubLinkTab: React.FC = () => {
  const { profile, updateProfile, showToast } = usePortfolio();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(profile.githubUrl || '');

  const save = () => {
    const url = value.trim();
    if (url && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(url)) {
      showToast('Please enter a valid GitHub link, e.g. https://github.com/username', 'error');
      return;
    }
    updateProfile({ githubUrl: url });
    setEditing(false);
  };

  const cancel = () => {
    setValue(profile.githubUrl || '');
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="url"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
          }}
          placeholder="https://github.com/username"
          className="w-56 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={save}
          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
          title="Save GitHub link"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={cancel}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          title="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <a
        href={profile.githubUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
        title={profile.githubUrl ? 'Open GitHub profile' : 'No GitHub link set'}
      >
        <Github className="w-3.5 h-3.5" />
        <span>GitHub</span>
      </a>
      <button
        type="button"
        onClick={() => { setValue(profile.githubUrl || ''); setEditing(true); }}
        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        title="Edit GitHub link"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
