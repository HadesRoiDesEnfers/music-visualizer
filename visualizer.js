function main() {
    const canvas = document.getElementById("myCanvas")
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    class Bar{
        constructor(x,y,width,height,color,index){
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.color = color
            this.index = index
        }
        update(micInput){
            const sound = micInput * 1000
            if(sound > this.height){
                this.height = sound
            } else{
                this.height-=this.height*.03
            }
        }
        draw(context,volume){
            context.strokeStyle = this.color
            context.save()

            context.translate(0,0)
            context.rotate(this.index * 0.03)
            context.scale(1+volume*.2,1+volume*.2)
            context.beginPath()
            context.moveTo(this.x,this.y)
            context.lineTo(this.y,this.height)
            context.stroke()
            context.strokeRect(this.y,this.height,this.height/2,5)
            
            context.restore()
        }
    }
    
    const fftSize = 512
    const microphone = new Microphone(fftSize)
    let bars = []
    let barWidth = canvas.width/(fftSize/2)
    function createBars(){
        for(let i=0;i<(fftSize/2);i++){
            let color = 'hsl('+ i*2 +', 100%, 50%)'
            bars.push(new Bar(0,i,5,20,color,i))
        }
    }

    createBars()
    let angle = 0
    function animate(){
        if(microphone.initialized){
            ctx.clearRect(0,0,canvas.width,canvas.height)
            // generates audio samples from microphone
            const samples = microphone.getSamples()
            const volume = microphone.getVolume()
            // animates bars based on microphone data
            angle -= .0001 + (volume*.05)
            ctx.save()
            ctx.translate(canvas.width/2,canvas.height/2)
            ctx.rotate(angle)
            bars.forEach(function(bar,i){
                bar.update(samples[i])
                bar.draw(ctx,volume)
            })
            ctx.restore()
        }
        requestAnimationFrame(animate)
    }
    
    animate()
}

