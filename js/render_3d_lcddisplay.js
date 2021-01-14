var COLOR_TABLE = {
    "red": "#FF0000",
    "green": "#00FF00",
    "blue": "#0000FF",
    "hum": "#ba34eb",
    "captainhum": "#ba34eb",
    "kit": "#C0C0C0",
    "kitcate": "#C0C0C0",
    "chanella": "#FD6C9E",
    "typh": "#FD6C9E",
}

class LcdDisplay {
    constructor() {
        this.canvasElement = null;
        this.canvasContext = null;

        this.text = "";

        this.currColorHex = "#FF0000"

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
            if (color[0] == "#") {
                this.currColorHex = color
            }
            else if (color in COLOR_TABLE) {
                this.currColorHex = COLOR_TABLE[color];
            }
        }
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
        
        this.canvasContext.fillStyle = this.currColorHex;
        this.canvasContext.fillText(this.text, 35, 105);
        this.canvasTexture.needsUpdate = true;
    }
}
