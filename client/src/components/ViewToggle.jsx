import React from 'react';
import { FaThLarge, FaList } from 'react-icons/fa';
import Tooltip from './Tooltip';

const ViewToggle = ({ view, setView }) => (
  <div className="flex items-center gap-2">
    <Tooltip text="Grid View">
      <button
        onClick={() => setView('grid')}
        className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
        aria-label="Grid View"
      >
        <FaThLarge size={18} />
      </button>
    </Tooltip>

    <Tooltip text="List View">
      <button
        onClick={() => setView('list')}
        className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
        aria-label="List View"
      >
        <FaList size={18} />
      </button>
    </Tooltip>
  </div>
);

export default ViewToggle;
