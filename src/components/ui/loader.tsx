import { ScaleLoader } from "react-spinners";

const Loader = ({
  loading = true,
  color = "#2563eb",
  height = 35,
  width = 4,
  margin = 2,
  radius = 2,
  className = "",
}) => (
  <div
    className={`flex items-center justify-center w-full h-full ${className}`}
    style={{ minHeight: "100px" }}
  >
    <ScaleLoader
      loading={loading}
      color={color}
      height={height}
      width={width}
      margin={margin}
      radius={radius}
    />
  </div>
);

export default Loader;
