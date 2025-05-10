import React, { useState, KeyboardEvent } from 'react';
import './SearchBox.scss';

interface ModelOption {
  id: string;
  name: string;
  placeholder: string;
}

const modelOptions: ModelOption[] = [
  { id: 'default', name: 'Default', placeholder:'Ask text based queries' },
  { id: 'veo2', name: 'Veo2',  placeholder:''},
  { id: 'claude', name: 'Claude Sonnet',  placeholder:''},
];

interface SearchBoxProps {
  onSearch: (query: string, model: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelOption>(modelOptions[0]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query, selectedModel.id);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <div className="model-badge">
          <select
            value={selectedModel.id}
            onChange={(e) => {
              const model = modelOptions.find((m) => m.id === e.target.value);
              if (model) setSelectedModel(model);
            }}
          >
            {modelOptions.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask with ${selectedModel.name}`}
          className="search-input"
        />
      </div>


      <div className="search-options">
        <span className="search-option">Depth Search</span>
        <span className="search-option">Video Generation</span>
      </div>
    </div>
  );
};

export default SearchBox;
