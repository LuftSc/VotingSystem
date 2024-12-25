import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Props {
  ballotId: bigint
}

export default function StopBallot({ ballotId }: Props) {
  const { writeContractAsync, isMining } = useScaffoldWriteContract("VotingContract");

  const handleStopBallot = async () => {
    try {
      await writeContractAsync({
        functionName: "stopBallot",
        args: [ballotId],
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div>
      <p style={{marginTop: "4px", marginBottom: "4px"}}>Пока время голосования не истекло,<br /> его можно завершить досрочно</p>
      <button
        onClick={handleStopBallot}
        disabled={isMining}
        className={`mt-4 px-6 py-2 ${isMining ? "bg-gray-700 text-white px-4 py-2 rounded-lg" : "bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"}`}
      >
        {isMining ? "Завершение..." : "Завершить голосование"}
      </button>
    </div>
  );
}
