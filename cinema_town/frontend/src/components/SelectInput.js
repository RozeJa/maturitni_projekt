import React, { useEffect, useState } from 'react'
import './SelectInput.css'

function SelectInput(props) {
  const initiaValue = props.initValue

  const [inputValue, setInputValue] = useState(initiaValue);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [focus, setFocus] = useState(false)
  const options = props.options;

  useEffect(() => {
    setInputValue(initiaValue)
  }, [initiaValue])

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
    props.onChange({target: {
      value: option
    }});
    setFilteredOptions([]); // Skryj seznam možností
  };

  return (
    <div className="select-input-container">
      <input autoFocus={props.autoFocus}
        name={props.name}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 100)}
      />
      {filteredOptions.length > 0 && focus && (
        <div className='options-list-z-index'>
          <ul className="options-list">
            {filteredOptions.map((option, index) => (
              <li key={index} onClick={() => handleSelectOption(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SelectInput;