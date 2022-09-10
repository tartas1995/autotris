class Canvas {
    canvas;
    ctx;
    nbrOfColumns;
    nbrOfRows;
    pixelsPerBlock;

    constructor(canvas, nbrOfRows, nbrOfColumns, pixelsPerBlock) {
        this.canvas = canvas;
        this.nbrOfRows = nbrOfRows;
        this.nbrOfColumns = nbrOfColumns;
        this.pixelsPerBlock = pixelsPerBlock;
        this.ctx = canvas.getContext('2d');
        this.prepareCanvas();
    }

    getObjectFitSize(contains, containerWidth, containerHeight, width, height) {
        const doRatio = width / height;
        const cRatio = containerWidth / containerHeight;
        let targetWidth = 0;
        let targetHeight = 0;
        const test = contains ? doRatio > cRatio : doRatio < cRatio;
        if (test) {
            targetWidth = containerWidth;
            targetHeight = targetWidth / doRatio;
        } else {
            targetHeight = containerHeight;
            targetWidth = targetHeight * doRatio;
        }
        return {
            width: targetWidth,
            height: targetHeight,
            x: (containerWidth - targetWidth) / 2,
            y: (containerHeight - targetHeight) / 2
        }
    } 

    prepareCanvas() {
        // setup resolution
        this.canvas.height = this.nbrOfRows;
        this.canvas.width = this.nbrOfColumns;
        this.canvas.style.height = `${this.nbrOfRows * this.pixelsPerBlock}px`
        this.canvas.style.width = `${this.brOfColumns * this.pixelsPerBlock}px`
        // recalculating pixelsPerBlock // keeping it for future usage. maybe
        const dpi = window.devicePixelRatio;
        const originalHeight = this.canvas.height;
        const originalWidth = this.canvas.width;
        const dimensions = this.getObjectFitSize(true, this.canvas.clientWidth, this.canvas.clientHeight, this.canvas.width, this.canvas.height);
        this.canvas.width = dimensions.width * dpi;
        this.canvas.height = dimensions.height * dpi;
        const ratio = Math.min(
            this.canvas.clientWidth / originalWidth,
            this.canvas.clientHeight / originalHeight
        )
        this.ctx.scale(ratio * dpi, ratio * dpi);
    }

    clearCanvas() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    convertColor(color) {
        switch (color) {
            case 'cyan':
                return "#00FFFF";
            case 'blue':
                return "#0000FF";
            case 'orange':
                return "#FFA500";
            case 'yellow':
                return "#FFFF00";
            case 'green':
                return "#00FF00";
            case 'purple':
                return "#800080";
            case 'red':
                return "#FF0000";
            default: 
                return "#000000"
        }
    }

    drawBlock(color, positionX, positionY) {
        this.ctx.fillStyle = this.convertColor(color);
        this.ctx.fillRect(positionX, positionY, 1, 1);
    }
}

export default Canvas;