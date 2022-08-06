// DOM 선언
const playground = document.querySelector(".playground > ul");
const GAME_ROWS = 20;
const GAME_COLS = 10;
// var
let score = 0; // 점수
let duration = 500; // 블록 이동 시간 ms
let downInterval; //

const BLOCKS = {
  tree: [
    // ㅗ 모양 블럭
    [
      [2, 1],
      [0, 1],
      [1, 0],
      [1, 1],
    ], // direction 0 일 경우
    [
      [1, 2],
      [0, 1],
      [1, 0],
      [1, 1],
    ], // direction 1 일 경우
    [
      [1, 2],
      [0, 1],
      [2, 1],
      [1, 1],
    ], // direction 2 일 경우
    [
      [1, 2],
      [1, 0],
      [2, 1],
      [1, 1],
    ], // direction 3 일 경우
  ],
}; // 블럭 모양 좌표
let tempMovingItem; // 이동하는 블럭
const movingItem = {
  // 블럭 기본 선언
  type: "tree",
  direction: 0, // 화살표에 따른 모양변화 변수
  top: 0, // 블럭 모양 시작좌표
  left: 3, // 블럭 모양 시작좌표
};

// li 20*10 개를 각각 좌표로 인식해서 처리하도록 함.
// 최상단 0,0

init();
// 초기 화면 셋팅
function init() {
  // 초기 블럭값 셋팅
  // movinItem의 값만을 가져와서 사용함. movingItem의 값이 변경되는 것과 무관하게 사용하기 위함
  // 스프레드 오퍼레이터 사용{...var}
  tempMovingItem = { ...movingItem };

  for (let i = 0; i < GAME_ROWS; i++) {
    prependMatrix();
  }
  renderBlocks();
}

// tetris 화면 구성 matrix
function prependMatrix() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

// 블럭 그리는 함수
function renderBlocks(moveType="") {
  // 디스트럭쳐링으로 tmepmovinItem 내의 프러퍼티를 바로 변수처럼 사용
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });
  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    // playground 를 벗아나는 경우 예외처리는 삼항 연산자로 처리
    const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
    //좌 우가 비었는지 체크
    const isAvailable = checkEmpty(target);
    if(isAvailable){
        target.classList.add(type, "moving");
    } else {
        tempMovingItem = {...movingItem};
        // renderBlocks() // 재귀함수 호출이 됨 -> callstack maximum exceed 에러 발생함 setTimeout 함수로 큐로 빼서 호출
        setTimeout(() => {
            renderBlocks();
            // 바닥에 닿았을때 블럭을 고정시킴
            if(moveType === 'top') {
                seizeBlock();
            }
        },0);
        // forEach 구문에서는 break 가 안됨
        // forEach -> some 구문으로 변경한 후 return true 로 반복문을 멈추는 것이 효율적
        return true;
    }
  });
  // render가 성공할때 마다 movingItem 값을 변환시킴
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock() {
    // 더 내려갈 곳이 없으면 moving class 제거 후 새로운 블록 생성
    const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
}
function checkEmpty(target) {
    if(!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  console.log(amount);
  renderBlocks(moveType);
}

function changeDirection() {
    tempMovingItem.direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

// 이벤트 핸들러
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
        changeDirection();
        break;
    default:
      break;
  }
});
