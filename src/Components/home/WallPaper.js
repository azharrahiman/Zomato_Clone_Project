import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Header from "../Header";
function WallPaper() {
  // let selectInput = useRef(); //IT WILL GIVE an element reference
  let [locationList, setLocationList] = useState([]);
  let [disabled, setDisabled] = useState(true);

  let getLocationList = async () => {
    try {
      let response = await axios.get("https://zc-app-prj.herokuapp.com/api/get-location");

      let data = response.data;
      // console.log(data);
      if (data.status === true) {
        setLocationList([...data.result]);
        // console.log(data);
      } else {
        setLocationList([]);
      }
    } catch (error) {
      console.log(error);
      alert("server error");
    }
  };
  let getLocationId = async (event) => {
    // console.log(value);
    let value = event.target.value;
    // console.log(value);
    if (value !== "") {
      try {
        let url = `https://zc-app-prj.herokuapp.com/api/get-restaurant-by-location-id/${value}`;
        let { data } = await axios.get(url);
        if (data.status == true) {
          if (data.result.length === 0) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        }
      } catch (error) {
        console.log(error);
        alert("server side error");
      }
    }
  };
  useEffect(() => {
    getLocationList();
  }, []); // [] ==> run it only once (onload ie mounting stage)
  return (
    <>
      <section className="main_image ">
        <Header />
        {/* <!-- header --> */}
        {/* <!-- icon --> */}
        <div className="row p-3 p-lg-0 justify-content-center">
          <div className="icon d-flex justify-content-center align-items-center">
            <p className="m-0 p-0">e!</p>
          </div>
        </div>
        {/* <!-- Title --> */}
        <div className="d-flex justify-content-center">
          <p className="title text-white fw-bold">
            Find the best restaurants, cafés, and bars
          </p>
        </div>
        {/* <!-- input items --> */}
        <div className="row justify-content-center">
          {/* <!-- location --> */}
          <div className="col-lg-3 col-8">
            <select
              // ref={selectInput}
              className="text-start form-control"
              onChange={getLocationId}
            >
              <option value="">Please select a location</option>
              {locationList.map((location, index) => {
                return (
                  <option value={location.location_id} key={index}>
                    {location.name},{location.city}
                  </option>
                );
              })}
            </select>
            {/* <ul className="loc_list d-lg-flex flex-column d-none px-1 text-muted bg-white p-0">
              <li className="text_size border-bottom">
                Sarjapur Road, Bengaluru
              </li>
              <li className="text_size border-bottom">HSR Layout, Bengaluru</li>
              <li className="text_size border-bottom">Kormangala, Bengaluru</li>
              <li className="text_size border-bottom">Jay Nagar, Bengaluru</li>
            </ul> */}
          </div>
          {/* <!-- search for resturant --> */}
          <div className="col-lg-4 col-8 mt-lg-0 mt-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="text-start form-control"
                placeholder="Search for restaurants"
                disabled={disabled}
              />
            </div>
            {/* <div className="display_rest_search"> */}
            {/* <ul className="d-lg-flex flex-column d-none p-0"> */}
            {/* <!-- list 1 --> */}
            {/* <li className="border-bottom d-flex align-items-center bg-white p-1 m-0">
                  <img
                    className="search_image"
                    src="/images/Breakfast.png"
                    alt=""
                  />

                  <div className="d-flex flex-column justify-content-center ms-3 text-white">
                    <p className="m-0 p-0 fw-bold text_size">
                      The Big Chill Cakery
                    </p>
                    <p className="m-0 p-0 text_size">
                      Sarjapur Road, Bengaluru
                    </p>
                  </div>
                </li> */}
            {/* <!-- list 2 --> */}
            {/* <li className="border-bottom d-flex align-items-center bg-white p-1 m-0">
                  <img
                    className="search_image"
                    src="/images/Breakfast.png"
                    alt=""
                  />

                  <div className="d-flex flex-column justify-content-center ms-3 text-white">
                    <p className="m-0 p-0 fw-bold text_size">Punjabi Rasoi</p>
                    <p className="m-0 p-0 text_size">MG Road, Punjab</p>
                  </div>
                </li> */}
            {/* <!-- list 3 --> */}
            {/* <li className="border-bottom d-flex align-items-center bg-white p-1 m-0">
                  <img
                    className="search_image"
                    src="/images/Breakfast.png"
                    alt=""
                  />

                  <div className="d-flex flex-column justify-content-center ms-3 text-white">
                    <p className="m-0 p-0 fw-bold text_size">
                      Kerala fish curry
                    </p>
                    <p className="m-0 p-0 text_size">Calicut, Kerala</p>
                  </div>
                </li> */}
            {/* </ul> */}
            {/* </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default WallPaper;
