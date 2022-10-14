import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate();

  let getTokenDetails = () => {
    // read the data from local storage
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [userLogin, setuserLogin] = useState(getTokenDetails);

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    // let data = jwt_decode(token);
    // console.log(data);
    // save the data
    localStorage.setItem("auth-token", token);
    Swal.fire({
      icon: "success",
      title: "Login Successfull.. ",
      text: "",
    }).then(() => {
      window.location.reload();
    });
  };
  let onError = () => {
    Swal.fire({
      icon: "error",
      title: "Oops..Failed Try again ",
      text: "",
    });
  };
  console.log(userLogin);
  let logout = () => {
    // remove data form local storage
    localStorage.removeItem("auth-token");
    Swal.fire({
      title: "Are you sure to Logout ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("auth-token");
        setuserLogin(false);
        window.location.reload();
      }
    });
  };
  return (
    <>
      <GoogleOAuthProvider clientId="408559668069-e8c3s51djgg9hc72nl57rfp6q080a73b.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="google_sign_in"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Google Sign In
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </div>
            </div>
          </div>
        </div>

        <header className={"header  mb-2 " + props.color}>
          <div className="logo_div">
            <p className="header_logo" onClick={() => navigate("/")}>
              e!
            </p>
          </div>
          {userLogin ? (
            <div>
              <div className="login">
                <span className="login_log">
                  Welcome, {userLogin.given_name}
                </span>
                <button className="login_create" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="login">
              <button
                className="login_log"
                data-bs-toggle="modal"
                data-bs-target="#google_sign_in"
              >
                Login
              </button>
              <button className="login_create">Create an Account</button>
            </div>
          )}
        </header>
      </GoogleOAuthProvider>
      ;
    </>
  );
}
export default Header;
