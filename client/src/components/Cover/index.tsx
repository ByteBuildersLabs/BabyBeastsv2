import { useAccount } from "@starknet-react/core";
import fight from '../../assets/img/banner.jpeg';
import SpawnBeast from "../SpawnBeast/index.tsx";
import { DeveloperCode } from "../DeveloperCode/index.tsx";
import Footer from "../Footer/index.tsx";

function Cover() {
  const { account } = useAccount();

  const handleMiniGames = () => {
    (document.querySelector('.navbar-toggler') as HTMLElement)?.click();
  }

  return (
    <>
      {
        account ? <SpawnBeast /> :
          <>
            <div className='cover'>
              <div className="mb-3">
                <img className="cover-pic" src={fight} alt="" />
              </div>
              <DeveloperCode />
            </div>
            <button className="connect-btn" onClick={handleMiniGames}>
              Connect and start Play
            </button>
            <Footer />
        </>
      }
    </>
  )
}

export default Cover;
