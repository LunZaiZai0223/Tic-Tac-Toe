// 創造玩家
/**
 * [description]
 * @param  {[String]} name     [玩家的姓名]
 * @param  {[String]} markType [玩家的符號]
 * @return {[Object]}          [新玩家]
 */
const Player = (playerName, markType) => {
  const _name = playerName;
  const _mark = markType;
  const getName = () => {
    return _name;
  };
  const getMark = () => {
    return _mark;
  };
  return { getName, getMark };
};

/**
 * DOM 控制
 */
const Control = (() => {
  const _overlay = document.querySelector('#overlay');
  const _choosePlayModeEle = document.querySelector('[data-choose-play-mode]');
  const _addPlayerForm = document.querySelector('[data-add-form]');
  const _gameBoardEle = document.querySelector('#board');
  const _cells = [...document.querySelectorAll('.cell[data-cell]')];
  const _resetBtn = document.querySelector('.gameboard button');
  const _winningMsgEle = document.querySelector('[data-winning-msg]');

  let _players = {};
  let isPlayingWithAi = false;
  /**
   * [clickHandler description]
   * @param  {[Event]} event [可以用來確認點擊的元素是否是我想要的]
   * 1. 判斷是案哪個
   */
  function clickHandler (event) {
    _closeChoosePlayModeEle();
    _modeChecker(event.target);
  }
  function _closeChoosePlayModeEle () {
    _choosePlayModeEle.classList.remove('is-active');
  }
  /**
   * [_modeChecker description]
   * @param  {[HTMLElement]} target [click event 的 target]
   */
  function _modeChecker (target) {
    const aiModeBtn = document.querySelector('#play-with-ai-btn');
    const humanModeBtn = document.querySelector('#play-with-human-btn');
    if (target === aiModeBtn) {
      console.log('Start playing with AI');
      isPlayingWithAi = true;
      const aiImgEle = document.querySelector('[data-robot-avater]');
      aiImgEle.src = 'https://i.pinimg.com/564x/12/0e/9c/120e9c53777ae652de1430dfa9f248b9.jpg';
      _players = Game.aiModePlayerSetting();
      closeOverlay();
      setPlayerName();
    } else {
      console.log('Start playing with human');
      _openAddPlayerForm();
    }
    Game.startGame();
  }
  function submitHandler (event) {
    event.preventDefault();
    getPlayerName();
    setPlayerName();
    closeOverlay();
    closeAddPlayerForm();
  }
  function setPlayerName () {
    // 把 nodeList 轉為 arr => 可用 arr 的方法
    const playerNamesEle = [...document.querySelectorAll('.player-name')];
    playerNamesEle[0].innerText = _players.player1.getName();
    playerNamesEle[1].innerText = _players.player2.getName();
  }
  function getPlayerName () {
    _players = Game.addPlayersName();
  }
  function closeOverlay () {
    _overlay.classList.remove('is-active');
  }
  function closeAddPlayerForm () {
    _addPlayerForm.classList.remove('is-active');
  }
  function _openAddPlayerForm () {
    _addPlayerForm.classList.add('is-active');
  }
  function showWinner (currentClass) {
    let winner;
    if (currentClass === 'x') {
      winner = _players.player1.getName();
    } else {
      winner = _players.player2.getName();
    }
    _winningMsgEle.innerText = `${winner}贏了！🎉🎉`;
    _winningMsgEle.classList.add('is-active');
  }
  function showDrawMsg () {
    _winningMsgEle.innerText = '平手';
    _winningMsgEle.classList.add('is-active');
  }
  function restartGame () {
    _cells.forEach(cell => {
      cell.classList.remove('x');
      cell.classList.remove('circle');
    });
    _gameBoardEle.classList.remove('end-game');
    _winningMsgEle.classList.remove('is-active');
    if (Game.checkingIsStillPlayingWithAi()) {
      isPlayingWithAi = !isPlayingWithAi;
    }
    Game.startGame();
  }
  /**
   * [showTurnMsg description]
   * 依照輪次顯示目前輪到誰
   */
  function showTurnMsg () {
    const isYourTurnEle = document.querySelectorAll('[data-is-your-turn]');
    if (_gameBoardEle.className.includes('circle')) {
      isYourTurnEle[1].classList.add('is-active');
      isYourTurnEle[0].classList.remove('is-active');
    } else {
      isYourTurnEle[0].classList.add('is-active');
      isYourTurnEle[1].classList.remove('is-active');
    }
  }
  function getPlayingMode () {
    return isPlayingWithAi;
  }
  function setPlayingMode () {
    isPlayingWithAi = !isPlayingWithAi;
  }


  _resetBtn.addEventListener('click', restartGame);
  _choosePlayModeEle.addEventListener('click', clickHandler);
  _addPlayerForm.addEventListener('submit', submitHandler);
  return { showWinner, showDrawMsg, restartGame, showTurnMsg, getPlayingMode, setPlayingMode};

})();

/**
 * 遊戲控制
 */
const Game = (() => {
  const _gameBoardEle = document.querySelector('#board');
  const _xClass = 'x';
  const _circleClass = 'circle';
  const _cells = [...document.querySelectorAll('.cell[data-cell]')];
  const _winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  /**
   * 也許就在 Game 裡面保存一開始定義是否與電腦玩
   * 之後再用保存（也就是就的結果回去 restGame 讓電腦知道現在還是要跟 ai 玩）
   */
  let _isCircleTurn;
  let _isCurrentPlayingWithAi = Control.getPlayingMode();

  function addPlayersName () {
    const playerOneNameName = document.querySelector('#player1').value;
    const playerTwoNameName = document.querySelector('#player2').value;
    console.log(document.querySelector('#player1').value, document.querySelector('#player2'));
    console.log(playerOneNameName, playerTwoNameName);
    const player1 = Player(playerOneNameName, 'X');
    const player2 = Player(playerTwoNameName, 'O');
    console.log(player1, player2);
    console.log(player1.getName());
    console.log(player2.getName());
    return { player1, player2 };
  }
  function aiModePlayerSetting () {
    const player1 = Player('AI', 'X');
    const player2 = Player('Human', 'O');
    return { player1, player2 };
  }
  function startGame () {
    console.log('開始囉！');
    _gameBoardEle.classList.remove('end-game');
    _isCircleTurn = false;
    aiPlay();
    _checkTurn();
    for (cell of _cells) {
      cell.classList.remove(_xClass);
      cell.classList.remove(_circleClass);
      cell.removeEventListener('click', _clickHandler);
      cell.addEventListener('click', _clickHandler, { once: true });
    }
  }
  /**
   * [aiPlay description]
   * 1. 延遲幾秒
   * 2. 以目前 cell 沒有 class 的 ele 隨便選一個
   */
  function aiPlay () {
    // true => playing with ai
    if (Control.getPlayingMode()) {
      console.log('AI 請動！');
      _isCurrentPlayingWithAi = Control.getPlayingMode();
      const noMarkCells = _cells.filter(cell => !cell.className.includes(_xClass) && !cell.className.includes(_circleClass));
      const randomNum = Math.floor(Math.random() * noMarkCells.length);
      const randomMark = noMarkCells[randomNum];
      console.log(randomNum);
      console.log(randomMark);
      console.log('怎麼不會動？');
      // noMarkCells[randomNum].classList.add(_xClass);
      // randomMark.className = `cell x`;
      console.log(randomMark);
      // noMarkCells[randomNum].classList.add(_xClass);
      console.log('怎麼不會動2？');
      // 結果竟然要 setTimeout 才可順利新增 class
      setTimeout(()=> {
       noMarkCells[randomNum].classList.add(_xClass);
       if (_checkWinner(_xClass)) {
         console.log('勝利者出現了');
         Control.showWinner(_xClass);
         _endGame();
       } else if (_isDraw()) {
         console.log('平手');
         Control.showDrawMsg();
         _endGame();
       }
       _cells.forEach(cell => {
        console.log(cell);
        if (cell.className.includes('x')) {
          cell.removeEventListener('click', _clickHandler);
        }
      });
     }, 100);
      console.log('我在後面');
      _isCircleTurn = true;
      /**
       * 1. 已經可以畫了
       * 2. 接下來就要持續更換 class 
       *   => 這樣子每次輪次結束後才會更換 Mark
       */
    }
  }
  function _checkTurn () {
    if (_isCircleTurn) {
      _gameBoardEle.classList.remove(_xClass);
      _gameBoardEle.classList.add(_circleClass);
    } else {
      _gameBoardEle.classList.remove(_circleClass);
      _gameBoardEle.classList.add(_xClass);
    }
    Control.showTurnMsg();
  }
  function _clickHandler (event) {
    console.log('有觸發 click');
    const clickedCell = event.target;
    // 如果 isCircleTurn = false => _xClass
    // 如果 isCircleTurn = true => _circleClass
    const currentTurn = _isCircleTurn ? _circleClass : _xClass;
    // true => 現在是和 AI 遊玩
    if (Control.getPlayingMode()) {
      _changeTurn();
      _checkTurn();
      _setMark(clickedCell, currentTurn);
      _changeTurn();
      _checkTurn();
      aiPlay();
    } else {
    _setMark(clickedCell, currentTurn);
    _changeTurn();
    _checkTurn();
    }
  }
  function _changeTurn () {
    _isCircleTurn = !_isCircleTurn;
  }
  function _setMark (cell, currentClass) {
    cell.classList.add(currentClass);
    // 該輪次畫完就會知道輸贏
    if (_checkWinner(currentClass)) {
      console.log('勝利者出現了！！！');
      Control.showWinner(currentClass);
      _endGame();
    } else if (_isDraw()) {
      console.log('平手');
      Control.showDrawMsg();
      _endGame();
    }
  }
  function _checkWinner (currentClass) {
    return _winningCombinations.some(combination => {
      return combination.every(index => {
        return _cells[index].classList.contains(currentClass);
      });
    });
  }
  function _isDraw () {
    return _cells.every(cell =>{
      return cell.classList.contains(_xClass) || cell.classList.contains(_circleClass);
    });
  }
  function _endGame () {
    _cells.forEach(cell => {
      cell.removeEventListener('click', _clickHandler);
    });
    if (Control.getPlayingMode()) {
      Control.setPlayingMode();
    }
    _gameBoardEle.classList.add('end-game');
  }
  function checkingIsStillPlayingWithAi () {
    console.log(_isCurrentPlayingWithAi);
    console.log(Control.getPlayingMode());
    return _isCurrentPlayingWithAi !== Control.getPlayingMode();
  } 
  return { addPlayersName, startGame, aiModePlayerSetting, checkingIsStillPlayingWithAi};
})();
