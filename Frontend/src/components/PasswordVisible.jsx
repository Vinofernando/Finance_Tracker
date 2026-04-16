import { Eye, EyeOff } from "lucide-react";
export const PasswordVisible = ({ showPassword, togglePassword, disabled }) => {
  return (
    <>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Masukkan password"
        style={{ paddingRight: "40px" }}
      />
      <button className="reset-visible" type="button" onClick={togglePassword}>
        {" "}
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
      </button>
      <button
        type="submit"
        className="forgot-btn"
        disabled={disabled}
        style={
          disabled
            ? { color: "gray", bacgroundColor: "darkblue" }
            : { color: "white" }
        }
      >
        submit
      </button>
    </>
  );
};
