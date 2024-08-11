import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import { langOptions } from "../constants/langOptions";

const LangsDropdown = ({ onSelectChange }) => {
  return (
    <Select
      placeholder={`English`}
      options={langOptions}
      
      defaultValue={langOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LangsDropdown;
