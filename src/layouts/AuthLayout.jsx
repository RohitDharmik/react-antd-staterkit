import MouseLight from "../components/MouseLight";

const AuthLayout = ({ children }) => {
  return (
    <>
      <MouseLight />

      {/* <div className="flex justify-center items-center h-screen"> */}
        {children}
      {/* </div> */}
    </>
  );
};

export default AuthLayout;
