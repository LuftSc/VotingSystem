import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function BallotResult() {
    const [ballotId, setBallotId] = useState<number>(-1);

    const { data } = useScaffoldReadContract({
        contractName: "VotingContract",
        functionName: "getResults",
        args: [BigInt(ballotId)],
    });

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Результаты голосования</h3>
            <input
                type="number"
                placeholder="Идентификатор(номер) голосования"
                onChange={e => setBallotId(e.target.value ? Number(e.target.value) : -1)}
                className="w-full p-2 mb-4 text-white rounded-lg bg-gray-800"
            />
            {data && (
                <div>
                    <ul>
                        {data[0].map((option: string, idx: number) => (
                        <li key={idx} className="text-lg mb-2">
                            {option}: {Number(data[1][idx])} голосов
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}