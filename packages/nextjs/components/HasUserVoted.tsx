import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Props {
  ballotId: bigint
}

export default function HasUserVoted({ ballotId }: Props) {
  const [userAddress, setUserAddress] = useState<string>("");

  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "hasUserVoted",
    args: [ballotId, userAddress],
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>;

  return (
    <div className="p-4 bg-blue-500 text-white shadow-md mt-4 w-full max-w-3xl rounded-lg">
      {hasVoted ? (
        <p className="text-xl font-semibold">Вы уже проголосовали в этом голосовании.</p>
      ) : (
        <p className="text-xl font-semibold">Вы ещё не проголосовали в этом голосовании.</p>
      )}
    </div>
  );
}
