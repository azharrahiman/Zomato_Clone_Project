import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function QuickSearch() {
  let navigate = useNavigate();
  let [mealTypeList, setMealTypeList] = useState([]);

  let getMealTypes = async () => {
    try {
      let response = await axios.get(
        "https://zc-app-prj.herokuapp.com/api/get-meal-types"
      );
      let { status, result } = response.data;
      if (status == true) {
        setMealTypeList([...result]);
      } else {
        setMealTypeList([]);
      }
    } catch (error) {
      alert("server side error");
    }
  };

  let getQuickSearchPage = (id) => {
    navigate("/search-page/" + id);
  };

  useEffect(() => {
    getMealTypes();
  }, []);
  // [] ==> useeffect will run once.
  // console.log(mealTypeList);
  return (
    <>
      <section className="py-lg-5 py-2 card mb-5">
        {/* <!-- titles --> */}
        <div className="row m-2 justify-content-center">
          <div className="col-9 align-items-center ms-4">
            <p className="ms-lg-5 m-0 h3 fw-bolder p-0">Quick Searches</p>
            <p className="ms-lg-5 m-0 discover text-muted p-0">
              Discover restaurants by type of meal
            </p>
          </div>
        </div>
        {/* <!-- food image --> */}

        <section className="row mx-4 justify-content-around">
          <div className="col-10 row justify-content-center">
            {/* <!-- first image --> */}
            {mealTypeList.map((mealType, index) => {
              return (
                <article
                  key={index}
                  className="search_list_divs col-lg-3 col-12 ms-0 mt-3 border article_border row p-0 d-flex"
                  onClick={() => getQuickSearchPage(mealType.meal_type)}
                >
                  <div className="col-6 p-0 m-0">
                    <img
                      className="foodimage"
                      src={"/images/" + mealType.image}
                      alt=""
                    />
                  </div>
                  <div className=" col-6 m-0 p-lg-1 p-0 d-flex flex-column justify-content-center">
                    <p className="image_title image_title fw-bold fs-6 m-0 p-lg-2">
                      {mealType.name}
                    </p>
                    <p className="image_def text-muted subtitle m-0 p-lg-2">
                      {mealType.content}
                    </p>
                  </div>
                </article>
              );
            })}
            {/* <!-- second image -->
            <article className="col-lg-3 col-12 ms-lg-5 ms-0 mt-3 border article_border row p-0 d-flex">
              <div className="col-6 p-0 m-0">
                <img className="foodimage" src="/images/Lunch.png" alt="" />
              </div>
              <div className="col-6 m-0 p-lg-1 p-0 d-flex flex-column justify-content-center">
                <p className="image_title fw-bold fs-6 m-0 p-lg-2">Lunch</p>
                <p className="text-muted image_def subtitle m-0 p-lg-2">
                  Start your day with exclusive breakfast options
                </p>
              </div>
            </article>
            {/* <!-- third image --> */}
            {/* <article className="col-lg-3 col-12 ms-lg-5 ms-0 mt-3 border article_border row p-0 d-flex">
              <div className="col-6 p-0 m-0">
                <img className="foodimage" src="/images/Snacks.png" alt="" />
              </div>
              <div className="col-6 m-0 p-lg-1 p-0 d-flex flex-column justify-content-center">
                <p className="image_title fw-bold fs-6 m-0 p-lg-2">Snacks</p>
                <p className="text-muted image_def subtitle m-0 p-lg-2">
                  Start your day with exclusive breakfast options
                </p>
              </div>
            </article> */}
            {/* <!-- fourth image --> */}
            {/* <article className="col-lg-3 col-12 ms-0 mt-3 border article_border row mt-3 p-0 d-flex">
              <div className="col-6 p-0 m-0">
                <img className="foodimage" src="/images/Dinner.png" alt="" />
              </div>
              <div className="col-6 m-0 p-lg-1 p-0 d-flex flex-column justify-content-center">
                <p className="image_title fw-bold fs-6 m-0 p-lg-2">Dinner</p>
                <p className="text-muted image_def subtitle m-0 p-lg-2">
                  Start your day with exclusive breakfast options
                </p>
              </div>
            </article> */}
            {/* <!-- fifth image --> */}
            {/* <article className="col-lg-3 col-12 ms-lg-5 ms-0 mt-3 border article_border row mt-3 p-0 d-flex">
              <div className="col-6 p-0 m-0">
                <img className="foodimage" src="/images/Drinks.png" alt="" />
              </div>
              <div className="col-6 m-0 p-lg-1 p-0 d-flex flex-column justify-content-center">
                <p className="image_title fw-bold fs-6 m-0 p-lg-2">Drinks</p>
                <p className="text-muted image_def subtitle m-0 p-lg-2">
                  Start your day with exclusive breakfast options
                </p>
              </div>
            </article> */}
            {/* <!-- sixth image --> */}
            {/* <article className="col-lg-3 col-12 ms-lg-5 ms-0 mt-3 border article_border row mt-3 p-0 d-flex">
              <div className="col-6 p-0 m-0">
                <img className="foodimage" src="/images/Nightlife.png" alt="" />
              </div>
              <div className="col-6 m-0 p-lg-1 p-0 d-flex flex-column justify-content-center">
                <p className="image_title fw-bold fs-6 m-0 p-lg-2">Nightlife</p>
                <p className="text-muted image_def subtitle m-0 p-lg-2">
                  Start your day with exclusive breakfast options
                </p>
              </div>
            </article> */}
          </div>
        </section>
      </section>
    </>
  );
}
export default QuickSearch;
