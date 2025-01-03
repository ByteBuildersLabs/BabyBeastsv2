import { useConnect, useAccount, useDisconnect} from "@starknet-react/core";
import dojo from '../../img/dojo-icon.svg'

const ControllerConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect()

  return (
    <div>
      {connectors.map((connector) => (
        status === "connected" ? (
          <div key={connector.id}>
            <button className="connect-btn">
              Account ...{address?.slice(-6)}
            </button>
            <button
              onClick={() => disconnect()}
              className="connect-btn"
            >
              Disconnect
            </button>
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
