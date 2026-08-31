import "./SelectField.css";
import { useEffect, useRef, useState } from "react";

type SelectOption = {
  label: string;
  value: string;
};
type Props = {
  title: string;
  values: string[] | SelectOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
};

export function SelectField({
  title,
  values,
  value,
  onChange,
  required = false,
  error
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };
  const selectedLabel =
  values.find((item) =>
    typeof item === "string"
      ? item === value
      : item.value === value
  );

const displayValue =
  typeof selectedLabel === "string"
    ? selectedLabel
    : selectedLabel?.label ?? "";

  return (
    <div className="selectField" ref={selectRef}>
      <label className="selectFieldTitle">
        {title}
        {required && <span> *</span>}
      </label>

      <button
        type="button"
        className={`selectFieldButton ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "" : "placeholder"}>
          {displayValue || "Выберите значение"}
        </span>

        <span className={`selectArrow ${isOpen ? "rotate" : ""}`}>
          v
        </span>
      </button>
      {error && (
        <p className="inputErrorText">
          {error}
        </p>
      )}

      {isOpen && (
        <div className="selectFieldDropdown">
          {values.map((item) => {
            const optionValue =
              typeof item === "string" ? item : item.value;

            const optionLabel =
              typeof item === "string" ? item : item.label;

            return (
              <button
                type="button"
                key={optionValue}
                className={`selectOption ${optionValue === value ? "selected" : ""
                  }`}
                onClick={() => handleSelect(optionValue)}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}