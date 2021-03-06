class LcdDisplay {
    constructor() {
        this.canvasElement = null;
        this.canvasContext = null;

        this.text = "";

        this.currColorHex = "#FF0000"
        this.currColorFunc = null;

        this.colorMode = "hex";

        this.prepareCanvas();

        this.canvasTexture = new THREE.CanvasTexture(this.canvasElement);

        this.material = new THREE.MeshBasicMaterial( {
            map: this.canvasTexture,
            opacity: 1,
            transparent: true,
        });
        this.geometry = new THREE.PlaneGeometry();
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.z = 1;
        this.mesh.scale.x = this.mesh.scale.y = 1;
    }

    setText(text) {
        this.text = text.replace(/ /gi, "!");
    }

    setColor(color) {
        if (typeof color == "string") {
            this.currColorHex = color
        }
    }

    setColorFunc(func) {
        this.currColorFunc = func;
    }

    prepareCanvas() {
        this.canvasElement = document.getElementById("2dtext");
        this.canvasContext = this.canvasElement.getContext("2d");
        
        var f = new FontFace('dseg', 'url(/fonts/dseg/DSEG14Modern-Regular.ttf)');
        
        f.load().then(() => {
            this.canvasContext.font = "72px dseg";
        });
    }

    drawCanvas() {
        this.canvasContext.fillStyle = "#000000";
        this.canvasContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        
        if (this.colorMode == "func" && this.currColorFunc) {
            for (var i in this.text) {
                let c = this.text[i];
                this.canvasContext.fillStyle = this.currColorFunc(i, c);
                this.canvasContext.fillText(c, 35+i*58.8, 105);
            }
        }
        else {
            this.canvasContext.fillStyle = this.currColorHex;
            this.canvasContext.fillText(this.text, 35, 105);
        }
        
        this.canvasTexture.needsUpdate = true;
    }
}
