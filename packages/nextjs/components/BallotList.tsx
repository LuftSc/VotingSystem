import StopBallot from "~~/components/StopBallot";
import HasUserVoted from "~~/components/HasUserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function BallotList() {
    const { data: ballotCount } = useScaffoldReadContract({
        contractName: "VotingContract",
        functionName: "getBallotCount",
      });

    const renderBallots = () => {
        if (!ballotCount) return <p>Загрузка...</p>;

        const ballot = [];

        for (let i: number = 0; i < ballotCount; i++) {
            ballot.push(<BallotItem key={i} ballotId={BigInt(i)} />);
        }

        return ballot;
    };

    return (
        <div>
          <h2 className="text-2xl font-bold mb-4 mt-10">Список голосований</h2>
          {ballotCount && ballotCount > 0 ? renderBallots() : <p className="text-xl">Нет активных голосований</p>}
        </div>
    );
}


interface Props {
    ballotId: bigint
}

function BallotItem({ ballotId }: Props) {
    const { data } = useScaffoldReadContract({
        contractName: "VotingContract",
        functionName: "getBallotsDetails",
        args: [BigInt(ballotId)],
    });
    
    const { writeContractAsync } = useScaffoldWriteContract("VotingContract");
    if (!data) return <p>Загрузка...</p>;
    
    const [proposal, options, , isActive] = data;

    return (
        <div>
          <h3 className="text-xl font-semibold text-black mt-10">{proposal}</h3>
          <div style={{display: "flex", flexDirection: "row", gap: "50px"}}>
            <ul className="mt-2 mb-4 ">
                {options.map((opt: string, idx: number) => (
                <li key={idx} className="flex justify-center items-center space-x-40">
                    <span className="text-black">{opt}</span>
                    {isActive && (
                    <button
                        onClick={() =>
                        writeContractAsync({
                            functionName: "vote",
                            args: [BigInt(ballotId), BigInt(idx)],
                        })
                        }
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 my-1"
                    >
                        Голосовать
                    </button>
                    )}
                </li>
                ))}
            </ul>
            {isActive && <StopBallot ballotId={ballotId} />}
          </div>
          
          {!isActive && <p className="text-red-500">Голосование завершено</p>}
          
          <HasUserVoted ballotId={ballotId} />
        </div>
      );
}