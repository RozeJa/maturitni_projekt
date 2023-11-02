import React, { useState } from 'react'
import './SelectInput.css'

function SelectInput(props) {
  const [inputValue, setInputValue] = useState(props.initValue);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const options = props.options;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Filtruj možnosti na základě toho, co uživatel píše
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
    props.onChange(e);
  };

  const handleSelectOption = (option) => {
    setInputValue(option);
    setFilteredOptions([]); // Skryj seznam možností
  };

  return (
    <div className="select-input-container">
      <input autoFocus={props.autoFocus}
        name={props.name}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      {filteredOptions.length > 0 && (
        <ul className="options-list">
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleSelectOption(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SelectInput;