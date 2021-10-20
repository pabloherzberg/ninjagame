const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const WIDTH = canvas.width = 800
const HEIGHT = canvas.height = 700

//ANIMATION TIME CONTROL
let lastTime = 0
let timeToNextFootPrint = 0

let gravity = 20
let ground = 480
let gameSpeed = 0
let aceleration = .5
let maxSpeed = 10
let keys = []


//CONTROLERS

window.addEventListener('keydown', e => {
    keys[e.key] = true
    delete keys['break']

    
})

window.addEventListener('keypress', e => {
    if(e.key === 'c'){
        maxSpeed = 30
        player.stepVel = 10
    }

})

window.addEventListener('keyup', e => {
    delete keys[e.key]
    if(!keys['c']){
        maxSpeed = 10
        player.stepVel = 50
    }

    keys['break'] = true    
})


function moveBackground(){
    console.log(keys)
    if(keys['ArrowRight']){
        if( gameSpeed <= maxSpeed){
            gameSpeed += aceleration
        }
     
        layer5.speeModifier = 1
        player.state = 'run'
        player.flipH = 1
    }
    if(keys['ArrowLeft']){
        if(gameSpeed >= -maxSpeed){
            gameSpeed -= aceleration
        }
        layer5.speeModifier = 1
        player.state = 'run'
        player.flipH = -1
    }
    if(keys['x']){
        gameSpeed = 0
        player.state = 'attack'
  
    }
    if(keys[' ']){
       if(!player.shouldJump){
           player.jumpCounter = 0
           player.shouldJump = true
       }
    }

    if(keys[' '] && keys['ArrowRight']){
        if( gameSpeed <= maxSpeed){
            gameSpeed += aceleration
        }
        player.runVel = 8
        player.flipH = 1
        if(!player.shouldJump){
            player.jumpCounter = 0
            player.shouldJump = true
        }
       
    }

    if(keys[' '] && keys['ArrowLeft']){
        if(gameSpeed >= -maxSpeed){
            gameSpeed -= aceleration
        }
        player.state = 'run'
        player.flipH = -1
        if(!player.shouldJump){
            player.jumpCounter = 0
            player.shouldJump = true
        }
    }

    if(keys['break']){
        if(gameSpeed > 0){
            gameSpeed -= aceleration
        }
        if(gameSpeed < 0){
            gameSpeed += aceleration
        }
        if(gameSpeed === 0){
            delete keys['break']
        }
        if(player.posX <= WIDTH/2){
            layer5.speeModifier = .05
            gameSpeed -= aceleration
            player.posX++
        }
        if(player.posX >= WIDTH/2){
            layer5.speeModifier = .05
            gameSpeed += aceleration
            player.posX--
        }
        player.frameX = 0
        player.frameY = 0
        player.state = 'idle'
    }
   console.log(keys)
}

//BACKGROUND

const backgroundLayer1 = new Image()
backgroundLayer1.src = 'layer-1.png'

const backgroundLayer2 = new Image()
backgroundLayer2.src = 'layer-2.png'

const backgroundLayer3 = new Image()
backgroundLayer3.src = 'layer-3.png'

const backgroundLayer4 = new Image()
backgroundLayer4.src = 'layer-4.png'

const backgroundLayer5 = new Image()
backgroundLayer5.src = 'layer-5.png'

class Layer {
    constructor(image, speeModifier){
        this.x = 0
        this.y = 0
        this.width = 2400
        this.height = 700
        this.image = image
        this.speeModifier = speeModifier
        this.speed = gameSpeed * this.speeModifier
        this.animateBg = true
    }
    update(){
        //SCROLL
        if(this.animateBg){
            
            this.speed = gameSpeed * this.speeModifier      
            if(this.x <= -this.width){
                this.x = 0
            }
            if(this.x >= this.width){
                this.x = 0
            }       
            this.x = Math.floor(this.x - this.speed)
        }
    

    }
    draw(){
        ctx.drawImage(this.image, this.x - this.width, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
}


//PLAYER

const playerIdle = new Image()
playerIdle.src = 'idle.png'

const playerRun = new Image()
playerRun.src = 'run.png'

const playerAttack = new Image()
playerAttack.src = 'attack.png'

const playerJump = new Image()
playerJump.src = 'jump.png'

const images = [playerIdle, playerRun, playerAttack, playerJump]

class Player {
    constructor(images, speeModifier){
        //draw
        this.image = images[0]
        this.width = 168
        this.height = 216
        this.posX = 200
        this.posY = 480
        this.frameX = 0
        this.frameY = 0
        this.speeModifier = speeModifier
        this.speed = gameSpeed * this.speeModifier
        this.flipH = 1

        this.runVel = 1
        this.timeSinceStep = 0
        this.stepVel = 50
        this.jumpVel = 50
        this.shouldJump = false
        this.jumpCounter = 0
        this.jumpHeight = 20
        this.idleVel = 100
        this.attackVel = 35
        this.state = 'idle'
    }
    update(deltatime){
        this.timeSinceStep += deltatime

        if(this.state === 'idle'){
            this.image = images[0]
            this.width = 232
            this.height = 439

            if(this.timeSinceStep > this.idleVel){
                
                this.frameY = 0
                if(this.frameX >= 7){
                    this.frameX = 0
                }
                this.frameX++
    
                this.timeSinceStep = 0
            }
        }

        if(this.state === 'run'){
            this.image = images[1]
            this.width = 363 
            this.height = 458

            if(this.timeSinceStep > this.stepVel){
    
                this.frameY = 0
                if(this.frameX >= 4){
                    this.frameX = 0
                }else{
                    this.frameX++
                }
    
                this.timeSinceStep = 0
            }
        }

        if(this.state === 'attack'){
            this.image = images[2]
            this.width = 536 
            this.height = 495

            if(this.timeSinceStep > this.attackVel){
    
          
                if(this.frameX >= 2){
                    this.frameX = 0
                    if(this.frameY >= 2){
                        this.frameY = 0
                    }else{
                        this.frameY++
                    }
                }
                else{
                    this.frameX++
                }
                

                this.timeSinceStep = 0
            }
        }

        if(this.shouldJump){
            this.image = images[3]
            this.width = 362 
            this.height = 483
            
            if(this.timeSinceStep > this.jumpVel){
                
                if(this.frameY + this.frameX !== 3){


                    if(this.frameX >= 2){
                        this.frameX = 0
                        if(this.frameY >= 1){
                            this.frameY = 0
                        }else{
                            this.frameY++
                        }
                    }
                    else{
                        this.frameX++
                    }          
                    
                }
              
                this.timeSinceStep = 0
            }

            this.jumpCounter++
            if(this.jumpCounter < 15){
                this.posY -= this.jumpHeight
            }else if( this.jumpCounter > 14 && this.jumpCounter < 19){
                this.posY += 0
            }else if( this.jumpCounter < 33){
                this.posY += this.jumpHeight
            }

            if(this.jumpCounter >= 32){
                this.shouldJump = false
            }
        }
  
        if((keys['ArrowRight'] || keys['ArrowLeft']) && this.state !== 'attack'){
                     
                if(keys['ArrowRight']){
                    if(this.flipH === 1 && this.posX <= 600){
                        this.posX += this.runVel
                    }
                }
                if(keys['ArrowLeft']){
                    if(this.flipH === -1 && this.posX >= 200){
                        this.posX -= this.runVel
                    }
                }
            
        }

        

    }
    
    draw(){
        ctx.save()
        ctx.scale(this.flipH, 1)
        ctx.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.posX * this.flipH,
            this.posY, 
            this.width/3, 
            this.height/3 
        )
        ctx.restore()
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2)
const layer2 = new Layer(backgroundLayer2, 0.4)
const layer3 = new Layer(backgroundLayer3, 0.6)
const layer4 = new Layer(backgroundLayer4, 0.8)
const layer5 = new Layer(backgroundLayer5, 1)
const layers = [ layer1, layer2, layer3, layer4, layer5 ]

const player = new Player(images, .3)


 function animate(timestamp){
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    let deltaTime = timestamp - lastTime
    lastTime = timestamp
    
    moveBackground()
    layers.forEach( layer => {
        layer.update()
        layer.draw()
    })
    
    
    player.update(deltaTime)
    player.draw()

    requestAnimationFrame(animate)
}

animate(0)

