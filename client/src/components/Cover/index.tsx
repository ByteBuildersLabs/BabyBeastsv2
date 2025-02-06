import { useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import fight from "../../assets/img/banner.jpeg";
import Footer from "../Footer/index.tsx";
import SpawnBeast from "../SpawnBeast/index.tsx";

function Cover() {
  const { account } = useAccount();

  useEffect(() => {
    const bodyElement = document.querySelector(".body") as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove("day");
      bodyElement.classList.remove("night");
      bodyElement.style.backgroundSize = "cover";
      bodyElement.style.padding = "80px 15px 30px";
    }
  }, []);

  return (
    <>
      {account ? (
        <SpawnBeast />
      ) : (
        <>
          <div className="cover">
            <div className="mb-3">
              <img className="cover-pic" src={fight} alt="" />
            </div>
            <button
              className="connect-btn"
              onClick={() =>
                (
                  document.querySelector(".navbar-toggler") as HTMLElement
                )?.click()
              }
            >
              Connect and start Play
            </button>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Cover;
