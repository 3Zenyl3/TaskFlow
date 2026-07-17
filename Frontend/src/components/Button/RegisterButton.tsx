import "./RegisterButton.css"

type RegisterButtonProps = {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}
function RegisterButton({
  text,
  type = "button",
  onClick,
  disabled = false
}: RegisterButtonProps){
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

export default RegisterButton;