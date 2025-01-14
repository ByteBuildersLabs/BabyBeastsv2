import { SDK } from "@dojoengine/sdk";
import { useAccount } from "@starknet-react/core";
import { Schema } from "../../dojo/bindings.ts";
import Header from "../Header/index.tsx";
import BeastsBag from "../BeastsBag/index.tsx";
import fight from '../../assets/img/banner.jpeg';
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton';
import Footer from "../Footer/index.tsx";

function Cover({ sdk }: { sdk: SDK<Schema> }) {

  const { account } = useAccount();

  return (
    <>
    {
      account ? <BeastsBag sdk={sdk} /> : 
      <>
        <Header />
        <div className='cover'>
          <div className="mb-3">
            <img className="cover-pic" src={fight} alt="" />
          </div>
          <ControllerConnectButton />
          <Footer />
        </div>
      </>
    }
    </>
  )
}

export default Cover;
