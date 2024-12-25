import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateBallot() {
  const [proposal, setProposal] = useState<string>("");
  const [lifeTime, setLifeTime] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  

  const { writeContractAsync, isMining } = useScaffoldWriteContract("VotingContract");

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const createBallot = async () => {
    if (proposal && options.length > 1 && lifeTime > 0) {
      await writeContractAsync({
        functionName: "createBallot",
        args: [proposal, options, BigInt(lifeTime)],
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-10">Создать голосование</h2>
      <input
        type="text"
        placeholder="Тема голосования"
        value={proposal}
        onChange={e => setProposal(e.target.value)}
        className="w-full p-2 mb-4 text-white bg-gray-800 rounded-lg"
      />
      <p>Укажите, какие варианты для голосования будут доступны</p>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={optionInput}
          onChange={e => setOptionInput(e.target.value)}
          className="flex-1 p-2 mr-2 text-white bg-gray-800 rounded-lg"
        />
        <button onClick={addOption} className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded-lg">
          Добавить вариант
        </button>
      </div>
      <ul className="mb-4">
        {options.map((opt, idx) => (
          <li key={idx} className="text-lg">
            {opt}
          </li>
        ))}
      </ul>
      <p>Укажите время действия голсования (в секндах)</p>
      <input
        type="number"
        placeholder="Время жизни (в секундах)"
        value={lifeTime}
        onChange={e => setLifeTime(Number(e.target.value))}
        className="w-full p-2 mb-4 text-white rounded-lg bg-gray-800"
      />
      <button
        onClick={createBallot}
        disabled={isMining}
        className={`w-full py-2 text-white ${isMining ? "bg-gray-500 rounded-lg" : "bg-blue-500 rounded-lg hover:bg-blue-600"}`}
      >
        {isMining ? "Создание..." : "Создать голосование"}
      </button>
    </div>
  );
}
