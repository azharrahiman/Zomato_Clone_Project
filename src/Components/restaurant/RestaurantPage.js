import axios from "axios";
import { useDebugValue, useEffect } from "react";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import Header from "../Header";
import { useParams, useResolvedPath } from "react-router-dom";
import Swal from "sweetalert2";

function RestaurantPage() {
  let [tab, setTab] = useState(1);
  let { id } = useParams();

  let defaultValue = {
    aggregate_rating: 0,
    city: "",
    city_id: -1,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "",
    locality: "",
    location_id: -1,
    mealtype_id: -1,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: -1,
  };
  let [restaurant, setRestaurant] = useState({ ...defaultValue });
  let [MenuItems, setMenuItems] = useState([]);
  let [totalPrices, setTotalPrices] = useState(0);

  let getTokenDetails = () => {
    // read the data from local storage
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [userDetails, setUserDetails] = useState(getTokenDetails);

  let getRestaurantDetails = async () => {
    try {
      let URL = "http://localhost:5003/api/get-restaurant-details-by-id/" + id;
      let { data } = await axios.get(URL);
      if (data.status === true) {
        setRestaurant({ ...data.result });
      } else {
        setRestaurant({ ...defaultValue });
      }
    } catch (error) {
      alert("server error");
    }
  };
  let getMenuItems = async () => {
    try {
      let URL =
        "http://localhost:5003/api/get-menu-item-list-by-restaurant-id/" + id;
      let { data } = await axios.get(URL);
      if (data.status === true) {
        setMenuItems([...data.result]);
      } else {
        setMenuItems([]);
      }
      setTotalPrices(0);
    } catch (error) {
      alert("server error");
    }
  };
  let addItemQuantity = (index) => {
    let _menuItems = [...MenuItems];
    _menuItems[index].qty += 1;
    let _price = Number(_menuItems[index].price);

    setTotalPrices(totalPrices + _price);
    setMenuItems(_menuItems); //udpating menuItem state
  };
  let removeItemQuantity = (index) => {
    let _menuItems = [...MenuItems];
    _menuItems[index].qty -= 1;
    let _price = Number(_menuItems[index].price);

    setTotalPrices(totalPrices - _price);
    setMenuItems(_menuItems); //udpating menuItem state
  };
  async function loadScript() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  }
  let displayRazorpay = async () => {
    let isLoaded = await loadScript();
    if (isLoaded == false) {
      alert("sdk is not loaded");
    }
    var serverData = {
      amount: totalPrices,
    };
    var { data } = await axios.post(
      "http://localhost:5003/api/payment/gen-order",
      serverData
    );
    // console.log(data);
    // return false;
    var order = data.order;
    var options = {
      key: "rzp_test_2f48AotTvds9oe", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: data.currency,
      name: "My App Clone",
      description: "Buy a product",
      image: "https://1000logos.net/wp-content/uploads/2021/06/Zomato-logo.png",
      order_id: order.id, //generated at server side
      handler: async function (response) {
        var sendData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        var { data } = await axios.post(
          "http://localhost:5003/api/payment/verify",
          sendData
        );
        if (data.status === true) {
          Swal.fire({
            icon: "success",
            title: "order placed successfully",
            text: "",
          }).then(() => {
            window.location.assign("/");
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Payment Failed.. Retry again",
            text: "",
          });
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "9999999999",
      },
    };
    var rzp1 = window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  useEffect(() => {
    getRestaurantDetails();
  }, []);
  // console.log(tab);
  return (
    <>
      <Header color="bg-danger" />
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {MenuItems.map((menu_item, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8 ">
                      <p className="mb-1 h6">{menu_item.name}</p>
                      <p className="mb-1">@{menu_item.price}</p>
                      <p className="small text-muted">
                        {menu_item.description}
                      </p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + menu_item.image} alt="" />
                        {menu_item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addItemQuantity(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section">
                            <button
                              className="hand btn_add btn p-1 btn-info"
                              onClick={() => removeItemQuantity(index)}
                            >
                              -
                            </button>
                            <span>{menu_item.qty}</span>
                            <button
                              className="hand btn_add btn p-1 btn-info"
                              onClick={() => addItemQuantity(index)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className="p-0 my-2" />
                  </div>
                );
              })}
            </div>
            {totalPrices > 0 ? (
              <div className=" p-3 d-flex justify-content-between">
                <h3>Subtotal {totalPrices}</h3>
                <button
                  className="btn btn-danger"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                >
                  Proceed
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div class="mb-3">
                <label htmlFor="" className="form-label">
                  User Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter User name"
                  value={userDetails.name}
                  readOnly={true}
                  onChange={() => {}}
                />
              </div>
              <div class="mb-3">
                <label htmlFor="" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id=""
                  placeholder="eg:name@example.com"
                  value={userDetails.email}
                  readOnly={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  id=""
                  rows="3"
                  value="EKM"
                  onChange={() => {}}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Go Back
              </button>
              <button className="btn btn-success" onClick={displayRazorpay}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="row justify-content-center">
        <section className="col-11 p-0 m-0 d-flex  position-relative">
          <img
            className="last_page_image"
            src={"/images/" + restaurant.image}
            alt=""
          />
          <button className="btn-gallery position-absolute btn image_see">
            Click to see Image Gallery
          </button>
        </section>
        <section className="col-11">
          <h2 className="mt-3">{restaurant.name}</h2>
          <div className="d-flex justify-content-between align-items-start">
            <ul className="list-unstyled d-flex gap-3 fw-bold">
              <li className="pb-3 hand" onClick={() => setTab(1)}>
                Overview
              </li>
              <li className="pb-3 hand" onClick={() => setTab(2)}>
                Contact
              </li>
            </ul>
            {userDetails ? (
              <button
                className="btn btn-danger"
                data-bs-toggle="modal"
                href="#exampleModalToggle"
                role="button"
                onClick={getMenuItems}
              >
                Place Online Order
              </button>
            ) : (
              <button className="btn btn-danger" disabled={true}>
                Please Login To Place Order
              </button>
            )}
          </div>
          {tab === 1 ? (
            <section>
              <h4 className="mb-3">About this place</h4>
              <p className="m-0 fw-bold">Cuisine</p>
              <p className="mb-3 text-muted small">
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pValue, cValue) => {
                      return pValue.name + ", " + cValue.name;
                    })
                  : null}
              </p>
              <p className="m-0 fw-bold">Average Cost</p>
              <p className="mb-3 text-muted small">
                {restaurant.min_price} for two people(Approx.)
              </p>
            </section>
          ) : (
            <section>
              <h4 className="mb-3">Contact</h4>
              <p className="m-0 fw-bold">Phone Number</p>
              <p className="mb-3 text-muted small">
                +{restaurant.contact_number}
              </p>
              <p className="m-0 fw-bold">{restaurant.name}</p>
              <p className="mb-3 text-muted small">
                {restaurant.locality}, {restaurant.city}
              </p>
            </section>
          )}
        </section>
      </section>
    </>
  );
}
export default RestaurantPage;
