import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function SearchPageResult() {
  let navigate = useNavigate();
  let params = useParams();
  let { meal_id } = params;
  // console.log(params);
  // console.log(meal_id);
  let [restaurentList, setRestaurant] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setFilter] = useState({ meal_type: meal_id });
  let getLocationList = async () => {
    try {
      let response = await axios.get(
        "https://zc-app-prj.herokuapp.com/api/get-location"
      );

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
  let filterOperation = async (filter) => {
    let URL = "https://zc-app-prj.herokuapp.com/api/filter";

    // console.log(filter);
    try {
      let { data } = await axios.post(URL, filter);
      // console.log(data.newresult);
      if (data.status === true) {
        setRestaurant([...data.newresult]);
      }
    } catch (error) {
      alert("server error");
      console.log(error);
    }
  };
  let makeFilteration = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filter };
    switch (type) {
      case "location":
        if (Number(value) > 0) {
          _filter["location"] = Number(value);
        } else {
          delete _filter["location"];
        }
        break;
      case "sort":
        _filter["sort"] = Number(value);
        break;
      case "cost-for-two":
        let costForTwo = value.split("-");
        // console.log(costForTwo);
        filter["lcost"] = Number(costForTwo[0]);
        filter["hcost"] = Number(costForTwo[1]);
        break;
    }
    setFilter({ ..._filter });
    filterOperation(_filter);
  };

  // console.log(restaurentList);
  useEffect(() => {
    filterOperation(filter);
    getLocationList();
  }, []);
  return (
    <>
      {" "}
      <section>
        <div className="breakfast_title">Breakfast Places in Mumbai</div>
      </section>
      <main className="main_content">
        <section>
          <div className="filter_div">
            <label className="filter_heading space labels">Filters</label>
            <label htmlFor="select_location">Select Location</label>
            <select
              name="select_location"
              className="space location_area"
              onChange={(event) => makeFilteration(event, "location")}
            >
              <option value="-1" selected id="select_location">
                Select Location
              </option>
              {locationList.map((location, index) => {
                return (
                  <option value={location.location_id} key={index}>
                    {location.name},{location.city}
                  </option>
                );
              })}
            </select>
            <label className="space labels">Cuisine</label>
            <div className="location_div">
              <input type="checkbox" id="north" className="space" value="1" />
              <label htmlFor="north">North Indian</label>
              <br />
              <input type="checkbox" id="south" className="space" value="2" />
              <label htmlFor="south">South Indian</label>
              <br />
              <input type="checkbox" id="chinese" className="space" value="3" />
              <label htmlFor="chinese">Chinese</label>
              <br />
              <input
                type="checkbox"
                id="fastfood"
                className="space"
                value="4"
              />
              <label htmlFor="fastfood">Fast Food</label>
              <br />
              <input
                type="checkbox"
                id="streetfood"
                className="space"
                value="5"
              />
              <label htmlFor="streetfood">Street Food</label>
            </div>
            <label className="space labels">Cost For Two</label>
            <div className="Rate_div">
              <input
                value="0-500"
                type="radio"
                id="500"
                className="space"
                name="rate"
                onChange={(event) => makeFilteration(event, "cost-for-two")}
              />
              <label htmlFor="500">less than 500</label>
              <br />
              <input
                onChange={(event) => makeFilteration(event, "cost-for-two")}
                value="500-1000"
                type="radio"
                id="1000"
                className="space"
                name="rate"
              />
              <label htmlFor="1000">500 - 1000</label>
              <br />
              <input
                onChange={(event) => makeFilteration(event, "cost-for-two")}
                value="1000-1500"
                type="radio"
                id="1500"
                className="space"
                name="rate"
              />
              <label htmlFor="1500">1000 - 1500</label>
              <br />
              <input
                onChange={(event) => makeFilteration(event, "cost-for-two")}
                value="1500-2000"
                type="radio"
                id="2000"
                className="space"
                name="rate"
              />
              <label htmlFor="2000">1500 - 2000</label>
              <br />
              <input
                onChange={(event) => makeFilteration(event, "cost-for-two")}
                value="2000-999999"
                type="radio"
                id="2000+"
                className="space"
                name="rate"
              />
              <label htmlFor="2000+">2000+</label>
            </div>
            <label htmlFor="" className="space labels">
              Sort
            </label>
            <div className="low_to_high">
              <input
                value="1"
                type="radio"
                id="low"
                className=" space"
                name="low"
                onChange={(event) => makeFilteration(event, "sort")}
              />
              <label htmlFor="low">Price Low to High</label>
              <br />
              <input
                value="-1"
                type="radio"
                id="high"
                className=" space"
                name="low"
                onChange={(event) => makeFilteration(event, "sort")}
              />
              <label htmlFor="high">Price High to Low</label>
            </div>
          </div>
        </section>
        <section className="article_section">
          {restaurentList.map((restaurant, index) => {
            return (
              <article
                className="article"
                key={index}
                onClick={() => navigate("/restaurant/" + restaurant._id)}
              >
                <section className="article_1">
                  <div className="article_1_image">
                    <img
                      src={"/images/" + restaurant.image}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                  </div>
                  <div className="article_1_words">
                    <label className="article_label" htmlFor="">
                      {restaurant.name}
                    </label>
                    <p>{restaurant.city}</p>
                    <p>
                      {restaurant.locality}, {restaurant.city}
                    </p>
                  </div>
                </section>
                <hr className="hrline" />
                <section>
                  <div className="cuisines">
                    <div className="bakery">
                      <p>CUISINES</p>
                      <p>COST htmlFor TWO</p>
                    </div>
                    <div className="cost">
                      <p>
                        {restaurant.cuisine.reduce((pValue, cValue) => {
                          return pValue.name + ", " + cValue.name;
                        })}
                      </p>
                      <p>{restaurant.min_price}</p>
                    </div>
                  </div>
                </section>
              </article>
            );
          })}
          <div className="page_number">
            <ul className="list">
              <option value="" className="option"></option>
              <option value="" id="selected_1" className="option">
                1
              </option>
              <option value="" className="option">
                2
              </option>
              <option value="" className="option">
                3
              </option>
              <option value="" className="option">
                4
              </option>
              <option value="" className="option">
                5
              </option>
              <option value="" className="option"></option>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

export default SearchPageResult;
