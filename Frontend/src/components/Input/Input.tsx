import "./Input.css"

type InputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function Input({ type, placeholder, value, onChange }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input" />
  );
}

export default Input;