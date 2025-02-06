import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./main.css";

import Apple from "../../../assets/img/food/fruit_apple.png";
import Banana from "../../../assets/img/food/fruit_banana.png";
import Cherry from "../../../assets/img/food/fruit_cherry.png";

import initials from "../../../data/initials.tsx";

const initialFoodItems = [
  { name: "Apple", img: Apple, count: 5 },
  { name: "Banana", img: Banana, count: 3 },
  { name: "Cherry", img: Cherry, count: 2 },
];

const Food = ({
  handleAction,
  beast,
  account,
  client,
  showAnimation,
}: {
  handleAction: any;
  beast: any;
  account: any;
  client: any;
  showAnimation: (gifPath: string) => void;
}) => {
  const [foodItems, setFoodItems] = useState(initialFoodItems);

  const feedTamagotchi = (foodName: string) => {
    if (!beast) return;

    setFoodItems((prevFoodItems) =>
      prevFoodItems.map((item) =>
        item.name === foodName && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item,
      ),
    );

    // Get correct animation
    const eatAnimation = initials[beast.specie - 1].eatPicture;

    showAnimation(eatAnimation);

    // Dojo Call
    handleAction("Feed", () => client.actions.feed(account), eatAnimation);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="food-carousel">
      <Slider {...settings}>
        {foodItems.map(({ name, img, count }) => (
          <div className="food-slide" key={name}>
            <div className="food-label">
              <img src={img} alt={name} />
              <div className="food-text">
                <span className="food-name">{name}</span>
                <span className="food-value">Remaining: {count}</span>
                <button
                  className="button"
                  onClick={() => feedTamagotchi(name)}
                  disabled={count === 0} //Disable button if there is no food left
                >
                  Feed
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Food;
