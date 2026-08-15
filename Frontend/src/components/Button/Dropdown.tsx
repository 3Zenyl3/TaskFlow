import "./Dropdown.css"
import { HiOutlineChevronDown } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}


export function Dropdown({ title, options, value, onChange, error }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="statusWrapper" ref={wrapperRef}>
      <div className="statusButton" onClick={() => setIsOpen(!isOpen)}>
        <div className="currStatus">
          <span>{title}: {value}</span>
          <HiOutlineChevronDown className="iconArrowDown" />
        </div>
      </div>
      {isOpen && (
        <ul className="statusDropdown">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => selectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="inputErrorText">{error}</p>
      )}
    </div>
  );
}