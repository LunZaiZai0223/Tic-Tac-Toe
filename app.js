/**
 * GOALS:
 *   - 盡可能把全部的東西擠一個 module 中
 *   - 使用 module / factory function
 * 
 * 1. 先完成開場 DOM
 */

 /*
 Player Factory
  */
 function PlayerFactory (name, mark) {
   return {name, mark};
 }

const Game = (() => {
  let player1 = {};
  let player2 = {};
  // 直接強制 x 先開始
  let isCirclesTurn = false;
  let isWithAiPlay = false;
  let isGameEnd = false;
  const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]; 

  function setPlayerInPlayingWithAiMode () {
    player1 = PlayerFactory('AI', 'X');
    player2 = PlayerFactory('HUMAN', 'O');
  }
  function setPlayerInPlayingWithHumanMode (name1, name2) {
    player1 = PlayerFactory(name1, 'X');
    player2 = PlayerFactory(name2, 'O');
  }
  function getPlayer () {
    return { player1, player2 };
  }
  function getIsCirclesTurn () {
    return isCirclesTurn;
  }
  function setIsCirclesTurn () {
    isCirclesTurn = !isCirclesTurn;
  }
  function getPlayingMode () {
    // false => two players, true => with ai
    return isWithAiPlay;
  }
  function setPlayingMode () {
    // default false 
    // 更改狀態 => 與 ai 玩
    isWithAiPlay = !isWithAiPlay;
  }
  function getGameIsEnd () {
    return isGameEnd;
  }
  function setGameIsEnd () {
    isGameEnd = !isGameEnd;
  }
  function initialize () {
    isGameEnd = false;
    isCirclesTurn = false;
  }
  function getWinningCombinations () {
    return winningCombinations;
  }

  /*
  DOM 
   */
  const DomController = (() => {
    const _pageHeader = document.querySelector('[data-header]');
    const _menu = document.querySelector('[data-menu]');
    const _choosePlayingModeWrapper = document.querySelector('[data-choose-playing-mode-wrapper]');
    const _playWithAiBtn = document.querySelector('[data-play-with-ai-btn]');
    const _playWithHumanBtn = document.querySelector('[data-play-with-human-btn]');
    const _addPlayerForm = document.querySelector('[data-add-player-form]');
    const _playArea = document.querySelector('[data-play-area]');
    const _turnMsg = [...document.querySelectorAll('[data-turn-msg]')];
    const _winningMsgEle = document.querySelector('[data-winning-msg]');
    const _cells = [...document.querySelectorAll('[data-cell]')];
    const _gameBoard = document.querySelector('#board');
    const _restGameBtn = document.querySelector('[data-rest-btn]');
    // playerNameInput
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    // playerName
    const playerNameEle = document.querySelectorAll('[data-player-name]');

    /*
    Class Name
     */
    const _displayNoneClass = 'd-none';
    const _xClass = 'x';
    const _oClass = 'o';

    console.log(_pageHeader, _menu, _playWithAiBtn, _playWithHumanBtn, _addPlayerForm, _playArea, _winningMsgEle, _cells, _gameBoard);


    let isWithAIPlay = false;
    // 一律都讓 X 先開始
    let isCirclesTurn = false;
    // let player1 = {};
    // let player2 = {};
    
    function _closeMenu () {
      _menu.style.display = 'none';
    }
    function _openAddPlayerForm () {
      _addPlayerForm.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    function _openPageHeader () {
      _pageHeader.classList.remove(_displayNoneClass);
    }
    function _closeAddPlayerForm () {
      _addPlayerForm.style.transform = 'translate(-50%, -50%) scale(0)';
    }
    function _openPlayArea () {
      _playArea.style.transform = 'scale(1)';
    }
    function _setPlayerName () {
      const playerObj = Game.getPlayer();
      playerNameEle[0].innerText = playerObj.player1.name;
      playerNameEle[1].innerText = playerObj.player2.name;
    }
    function _clickHandler (event) {
      // with Ai play
      if (event.target === _playWithAiBtn) {
        isWithAIPlay = true;
        // 改變狀態 true => Ai Mode
        Game.setPlayingMode();
        _closeMenu();
        _openPageHeader();
        _openPlayArea();
        Game.setPlayerInPlayingWithAiMode();
        _setPlayerName();
        // _startGame();
      // human play
      } else if (event.target === _playWithHumanBtn) {
        _closeMenu();
        _openPageHeader();
        _openAddPlayerForm();
      }
      _startGame();
    }
    function _submitHandler (event) {
      event.preventDefault();
      _closeAddPlayerForm();
      // 不能直接宣告變數時就 .value 會的到空白 => 宣告連結記憶體時就會儲存空白
      Game.setPlayerInPlayingWithHumanMode(player1Input.value, player2Input.value);
      _setPlayerName();
      _openPlayArea();
    }
    function _setCellsEventListener (cellsEle) {
      cellsEle.forEach(cell => {
        cell.addEventListener('click', _cellClickHandler, { once: true });
      });
    }
    function _setMark (clickedCellEle, currentTurn) {
      if (!currentTurn) {
        clickedCellEle.classList.add(_xClass);
      } else {
        clickedCellEle.classList.add(_oClass);
      }
      console.log(Game.getIsCirclesTurn());
      // Game.setIsCirclesTurn();
      console.log(Game.getIsCirclesTurn());
      _checkWinner(Game.getIsCirclesTurn());
    }
    function _changeTurn () {
      console.log('Hit change!');
      // 轉換 x => o, o => x
      Game.setIsCirclesTurn();
      const isNowCircleTurn = Game.getIsCirclesTurn();
      if (!isNowCircleTurn) {
        _gameBoard.classList.remove(_oClass);
        _gameBoard.classList.add(_xClass);
        _turnMsg[0].style.opacity = 1;
        _turnMsg[1].style.opacity = 0;
      } else {
        _gameBoard.classList.remove(_xClass);
        _gameBoard.classList.add(_oClass);
        _turnMsg[1].style.opacity = 1;
        _turnMsg[0].style.opacity = 0;
      }
    }
    function _cellClickHandler (event) {
      const currentCell = event.target;
      _setMark(currentCell, Game.getIsCirclesTurn());
      // 判斷是不是 AI mode 
      if (Game.getPlayingMode()) {
        if (!Game.getGameIsEnd()) {
          _aiPlays();          
        }
      }
      // _changeTurn();
      // _changeTurn();
    }
    function _startGame () {
      Game.initialize();
      _setCellsEventListener(_cells);
      _winningMsgEle.style.opacity = 0;
      // 判斷是不是 ai mode
      if (Game.getPlayingMode()) {
        _aiPlays();
      } else {
        _turnMsg[0].style.opacity = 1;
        _turnMsg[1].style.opacity = 0;
      }
    }
    function _checkWinner (currentTurn) {
      const win = Game.getWinningCombinations();
      const currentClass = !currentTurn ? _xClass : _oClass;
      const result = win.some(combination => {
        return combination.every(index => {
          // every 有的話才會繼續找，要不然就會回傳 false
          // [x, x, x] => x... 
          return _cells[index].classList.contains(currentClass);
        });
      });
      if (result) {
        console.log('勝利者出現！');
        _endGame();
        _showWinningMsg(currentClass);
      } else {
        if (_isDraw()) {
          _winningMsgEle.style.opacity = 1;
          _winningMsgEle.innerText = `平手！`;
          _endGame();
        } else {
        _changeTurn();
        }
        // if (Game.getPlayingMode()) {
        //   _aiPlays();
        // }
      }
    }
    function _endGame () {
      _cells.forEach(cell => {
        cell.removeEventListener('click', _cellClickHandler);
      });
      _gameBoard.classList.remove(_xClass);
      _gameBoard.classList.remove(_oClass);
      Game.setGameIsEnd();
    }
    function _resetGame () {
      console.log('遊戲重置');
      Game.initialize();
      // false => x, true => o 
      if (_gameBoard.className.includes(_oClass)) {
        _gameBoard.classList.remove(_oClass);
        _gameBoard.classList.add(_xClass);
      }
      _cells.forEach(cell => {
        cell.classList.remove(_xClass);
        cell.classList.remove(_oClass);
      });
      _startGame();
    }
    function _showWinningMsg (currentTurn) {
      const obj = Game.getPlayer();
      _winningMsgEle.style.opacity = 1;
      if (currentTurn === _xClass) {
        _winningMsgEle.innerText = `${obj.player1.name}勝利了✌️！`;
      } else {
        _winningMsgEle.innerText = `${obj.player2.name}勝利了✌️！`;
      }
    }
    function _isDraw () {
      const allCellshaveClass = _cells.every(cell => {
        return cell.classList.contains(_xClass) || cell.classList.contains(_oClass);
      });
      return allCellshaveClass;
    }
    function _aiPlays () {
      console.log('AI moves!');
      const noMarkCells = _cells.filter(cell => !cell.classList.contains(_xClass) && !cell.classList.contains(_oClass));
      const randomIndex = Math.floor(Math.random() * noMarkCells.length);
      // 每次 AI 輪次要畫的格子
      const beSetMarkCellByAi = noMarkCells[randomIndex];
      beSetMarkCellByAi.classList.add(_xClass);
      // 刪除被 AI 畫的格子的 click event，因為是用 click event 來下 mark
      // AI 的 Mark 並沒有透過 click event 新增，所以人類用滑鼠點的時候會新增 o class => x 被蓋掉了
      beSetMarkCellByAi.removeEventListener('click', _cellClickHandler);
      _checkWinner(Game.getIsCirclesTurn());
      // _changeTurn();
    }
    // function _ () {

    // }

    // _openAddPlayerForm();
    
    /*
    Event
     */
    _choosePlayingModeWrapper.addEventListener('click', _clickHandler);
    _addPlayerForm.addEventListener('submit', _submitHandler);
    _restGameBtn.addEventListener('click', _resetGame);

    function getPlayingMode () {
      return isWithAIPlay;
    }

    return { getPlayingMode };
  })();

  console.log(`這個不會報錯${DomController.getPlayingMode()}`);
  return { 
    setPlayerInPlayingWithAiMode, 
    setPlayerInPlayingWithHumanMode,
    getPlayer, 
    getIsCirclesTurn, 
    setIsCirclesTurn, 
    getPlayingMode,
    setPlayingMode,
    getGameIsEnd,
    setGameIsEnd,
    initialize,
    getWinningCombinations
     };
})();




/*
以下之後要再整理
=> 叫用後 = 不是物件
 */
const func1 = (() => {

const func2 = (() => {
    let y = 2;
    function inner (x) {
    console.log(x + x);
    }
    return { inner };
  })();
        function outer () {
        console.log('123Outer');
        func2.inner();
    }
    outer();
})();