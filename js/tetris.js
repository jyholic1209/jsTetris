// DOM 선언
const playground = document.querySelector('.playground > ul');


// tetris 화면 구성 maxtix
for(let i=0; i<20; i++){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0; j <10; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }

    li.prepend(ul);
    playground.prepend(li);
}
console.log(playground)