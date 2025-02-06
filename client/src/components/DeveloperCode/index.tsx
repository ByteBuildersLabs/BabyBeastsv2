import { useState } from "react";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton";

export function DeveloperCode() {
  const [confirmed, setConfirmed] = useState(false);

  function confirmCode(e: { target: { value: string } }) {
    if (e.target.value === "babybeasts") {
      setConfirmed(true);
    }
  }

  return (
    <>
      {confirmed ? (
        <ControllerConnectButton />
      ) : (
        <input
          id="developer-code"
          onChange={(e) => confirmCode(e)}
          placeholder="Enter developer code"
          className="input"
        />
      )}
    </>
  );
}
