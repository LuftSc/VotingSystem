// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    // Структура - Голосование
    struct Ballot {
        // Выдвигаемое предложение
        string proposal;
        // Варианты для голосования
        string[] options;
        // Mapping для хранения количества голосов
        mapping(uint256 => uint256) voteCounts;
        // Mapping для хранения списка аккаунтов, имеющих право голоса
        mapping(address => bool) hasVoted;
        // Через сколько завершится голосование
        uint256 endTime;
        // Активно ли голосование сейчас (Можно ли голосовать?)
        bool isActive;
        // Аккаунт председателя(Создателя голосования)
        address chairperson;
    }
    // Список для хранения всех голосований
    Ballot[] public ballots;

    // Функция, создающая голосование
    // Для создания необходимо указать:
    // 1) Выдвигаемое предложения
    // 2) Варианты для голоса
    // 3) Время жизни голосования
    function createBallot(
        string memory _proposal,
        string[] memory _options,
        uint256 _lifeTime
    ) public {
        // Проверяем, что указано положительное время действия голосования
        require(_lifeTime > 0, "The voting lifetime must be > 0");
        // Проверяем, что количество вариантов для голосования > 1
        // Если для голосования только 1 вариант - то зачем оно тогда нужно
        require(
            _options.length > 1,
            "Voting with 1 variation of the answer is pointless!"
        );
        // Создаём новое голосование и добавляем его в список
        Ballot storage newBallot = ballots.push();
        // Устанавливаем свойствам значения
        newBallot.proposal = _proposal;
        newBallot.options = _options;
        newBallot.endTime = block.timestamp + _lifeTime;
        newBallot.isActive = true;
        // Назначем председателем тот аккаунт, который создал голосование
        newBallot.chairperson = msg.sender;
    }

    // Функция останавливающая голосование по его Id
    function stopBallot(uint256 _ballotId) public {
        // Проверяем, есть ли голосование с указанным Id в нашем списке
        require(
            _ballotId < ballots.length,
            "There is no such vote!"
        );
        // Если же оно всё-таки существует, достаём его из списка
        Ballot storage ballot = ballots[_ballotId];
        // Сразу же проверяем, активно ли оно на данный момент
        require(ballot.isActive, "Voting is inactive!");
        // Проверяем не истёк ли срок действия голосования
        require(block.timestamp >= ballot.endTime, "Voting is completed!");
        // Проверяем, является ли аккаунт, который хочет завершить голосование - председателем
        // Только председатель имеет право завершить голосование
        require(
            msg.sender == ballot.chairperson,
            "Only the chairperson can complete the voting!"
        );
        // Делаем голосование неактивным
        ballot.isActive = false;
    }

    // Функция, осуществляющая само голосование, чтобы проголосовать, нужно указать
    // 1) Id голосования
    // 2) Вариант для голоса
    function vote(uint256 _ballotId, uint256 _optionIndex) public {
        // Проверяем, есть ли указанное голосование в списке
        require(_ballotId < ballots.length, "There was no such vote!");

        Ballot storage ballot = ballots[_ballotId];
        // Сразу же проверяем, активно ли оно на данный момент
        require(ballot.isActive, "Voting is inactive!");
        // Проверяем не истёк ли срок действия голосования
        require(block.timestamp >= ballot.endTime, "Voting is completed!");
        // Проверяем, голосовал ли уже выбранный аккаунт или нет
        require(!ballot.hasVoted[msg.sender], "You have already voted");
        // Проверяем есть ли указанный вариант голосования
        require(_optionIndex < ballot.options.length, "There is no such option!");

        // Помечаем аккаунт как проголосовавший
        ballot.hasVoted[msg.sender] = true;
        // Увеличиваем количество голосов по варианту
        ballot.voteCounts[_optionIndex]++;
    }

    // Функция для получения информации о голосовании по Id
    function getBallotsDetails(uint256 _ballotId) public view
        returns (
            string memory proposal,
            string[] memory options,
            uint256 endTime,
            bool isActive,
            address chairperson
        )
    {
        // Проверяем, есть ли голосование в нашем списке
        require(_ballotId < ballots.length, "There is no such vote!");

        Ballot storage ballot = ballots[_ballotId];

        // Возвращаем всю информацию о конкретном голосовании:
        return (
            ballot.proposal, // Предложение
            ballot.options, // Варианты для голоса
            ballot.endTime, // Время окончания
            ballot.isActive, // Активно ли на данный момент
            ballot.chairperson // Адрес аккаунта председателя
        );
    }

    // Функция для проверки: голосовал ли уже аккаунт или нет
    function hasUserVoted(uint256 _ballotId, address _voter) public view
        returns (bool)
    {
        // Проверяем, есть ли в нашем списке указанный Id
        require(
            _ballotId < ballots.length,
            "There is no such vote!"
        );
        Ballot storage ballot = ballots[_ballotId];
        return ballot.hasVoted[_voter];
    }

    // Функция для подсчёта результатов голосования по Id
    function getResults(uint256 _ballotId) public view
        returns (string[] memory options, uint256[] memory voteCounts)
    {
        // Проверяем, есть ли такое голосование в списке
        require(_ballotId < ballots.length, "There is no such vote!");

        Ballot storage ballot = ballots[_ballotId];

        options = ballot.options;
        // Создаём массив размера = количеству вариантов в голосовании
        voteCounts = new uint256[](ballot.options.length);

        for (uint256 i = 0; i < ballot.options.length; i++) {
            // Для каждого варианта присваеваем количество голосов за него
            voteCounts[i] = ballot.voteCounts[i];
        }
    }

    // Функция для подсчёта количества голосований
    function getBallotCount() public view returns (uint256) {
        return ballots.length;
    }
}
