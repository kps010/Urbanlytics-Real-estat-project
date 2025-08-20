import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-4 left-4 px-4 py-2 bg-transparent text-white font-semibold rounded-lg cursor-pointer  hover:text-[#B97A41] transition duration-300 z-50"
    >
      Home
    </button>
  );
}

export default HomeButton;
