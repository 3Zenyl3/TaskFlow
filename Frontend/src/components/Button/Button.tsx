import "./Button.css"

type Button = {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}
function Button({
  text,
  type = "button",
  onClick,
  disabled = false
}: Button){
  return(
    <button
      type={type}
      onClick={onClick}
      disabled = {disabled}
      className="RegisterButton"
      >
        {text}
    </button>
  );
}

export default Button;