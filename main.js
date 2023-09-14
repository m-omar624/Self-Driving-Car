const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");


const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const N = 500;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i<cars.length; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain,0.03)
        }
    }

}

const traffic = [
    new Car(road.getLaneCenter(0), 100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), 100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1400,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1400,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1750,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1920,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1)-15, -1920,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2)+8, -1920,30,50,"DUMMY",2)
    
];
animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50, "AI"));
    }
    return cars;
}

function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders,[]);
        if((bestCar.y - 1920)%200 == 0){
            traffic.push( new Car(road.getLaneCenter(0), bestCar.y-1920,30,50,"DUMMY",2),)
        }
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar = cars.find(
        c=>c.y == Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i =0; i < traffic.length; i++){
        traffic[i].draw(carCtx,"grey");
    }
    carCtx.globalAlpha = 0.2;
    for(let i = 0 ; i<cars.length; i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}