import { RotatingLines } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loaderContainer">
      <RotatingLines
        strokeColor="blue"
        strokeWidth="5"
        animationDuration="0.75"
        width="50"
        visible={true}
      />
    </div>
  )
}

export default Loader
