import { Link } from 'react-router-dom';
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import dojo from '../../assets/img/dojo-icon.svg'

const ControllerConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect()

  return (
    <div>
      {connectors.map((connector) => (
        status === "connected" ? (
          <div key={connector.id}>
            <Link to="/">
              <button className="connect-btn" onClick={() => disconnect()}>
                Disconnect ...{address?.slice(-6)}
              </button>
            </Link>
          </div>
        ) : (
          <button
            key={connector.id}
            onClick={() => {
              connect({ connector });
            }}
            className="connect-btn"
          >
            Connect
            <img src={dojo} alt="starknet" />
          </button>
        )
      ))}
    </div>
  );
};

export default ControllerConnectButton;
