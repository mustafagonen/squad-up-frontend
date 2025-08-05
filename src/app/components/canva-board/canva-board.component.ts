import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import Konva from 'konva';
import { SharedModule } from '../../shared.module';
type ShapeType = 'rectangle' | 'circle' | 'arrow' | 'no-canva';

@Component({
    selector: 'mg-canva-board',
    templateUrl: './canva-board.component.html',
    styleUrls: ['./canva-board.component.scss'],
    imports: [SharedModule],
    standalone: true,
})
export class MgCanvaBoardComponent implements AfterViewInit {
    @ViewChild('stageRef') stageRef!: ElementRef;

    stage!: Konva.Stage;
    layer!: Konva.Layer;
    transformer!: Konva.Transformer;

    isDrawing = false;
    currentShape: Konva.Shape | null = null;
    startPos = { x: 0, y: 0 };

    selectedTool: ShapeType = 'arrow';
    selectedShape: Konva.Shape | null = null;

    private historyJSON: string[] = [];

    ngAfterViewInit(): void {
        this.stage = new Konva.Stage({
            container: this.stageRef.nativeElement,
            width: 957,
            height: 547,
        });

        this.stage.on('mousedown', (e) => {
            if (e.evt.button === 2) {
                // Sağ tık, hiçbir işlem yapma
                return;
            }

            // const target = e.target;

            // // Stage veya geçersiz bir hedefse işlem yapma
            // if (!target || target === this.stage) return;

            // // Güvenli işlem
            // if (target.setAttrs) {
            //     target.setAttrs({ stroke: 'red' });
            // }
        });

        this.stage.container().addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        // Başlangıçta boş snapshot al
        this.saveHistory();

        this.transformer = new Konva.Transformer({
            keepRatio: true,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        });
        this.layer.add(this.transformer);

        this.stage.on('mousedown', (e) => {
            if (e.evt.button !== 0) return;
            if (e.target === this.stage) {
                this.startDrawing(e);
            }
        });
        this.stage.on('mousemove', (e) => this.drawing(e));
        this.stage.on('mouseup', () => this.endDrawing());
        this.stage.on('mouseleave', () => this.endDrawing());

        this.stage.on('click', (e) => this.handleSelect(e));

        this.transformer.on('transformend', () => {
            if (!this.selectedShape) return;

            if (this.selectedShape instanceof Konva.Rect) {
                const scaleX = this.selectedShape.scaleX();
                const scaleY = this.selectedShape.scaleY();

                this.selectedShape.width(this.selectedShape.width() * scaleX);
                this.selectedShape.height(this.selectedShape.height() * scaleY);

                this.selectedShape.scaleX(1);
                this.selectedShape.scaleY(1);
            } else if (this.selectedShape instanceof Konva.Circle) {
                const scaleX = this.selectedShape.scaleX();
                this.selectedShape.radius(this.selectedShape.radius() * scaleX);

                this.selectedShape.scaleX(1);
                this.selectedShape.scaleY(1);
            }

            this.layer.batchDraw();
            this.saveHistory(); // Ölçekleme sonrası kaydet
        });
    }

    startDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
        if (this.isDrawing) return;
        if (this.selectedShape) this.deselectShape();
        if (e.target !== this.stage) return;

        const pos = this.stage.getPointerPosition();
        if (!pos) return;

        this.startPos = pos;
        this.isDrawing = true;

        switch (this.selectedTool) {
            case 'rectangle':
                this.currentShape = new Konva.Rect({
                    x: pos.x,
                    y: pos.y,
                    width: 0,
                    height: 0,
                    fill: 'rgba(0, 255, 0, 0.25)',
                    stroke: '#00cc00',
                    strokeWidth: 2,
                    draggable: true,
                    listening: true,
                    visible: true,
                });
                break;
            case 'circle':
                this.currentShape = new Konva.Circle({
                    x: pos.x,
                    y: pos.y,
                    radius: 0,
                    fill: 'rgba(74, 144, 226, .4)',
                    stroke: '#4a90e2ff',
                    strokeWidth: 2,
                    draggable: true,
                    scaleX: 1,
                    scaleY: 1,
                });
                break;
            case 'arrow':
                this.currentShape = new Konva.Arrow({
                    points: [pos.x, pos.y, pos.x, pos.y],
                    pointerLength: 10,
                    pointerWidth: 10,
                    fill: 'orange',
                    stroke: 'orange',
                    strokeWidth: 3,
                    draggable: true,
                });
                break;
        }

        if (this.currentShape) {
            this.layer.add(this.currentShape);
            this.layer.draw();

            this.currentShape.on('dragstart', () => (this.isDrawing = false));
            this.currentShape.on('dragend', () => {
                this.layer.draw();
                this.saveHistory(); // Taşıma sonrası kaydet
            });
        }
    }

    drawing(e: Konva.KonvaEventObject<MouseEvent>) {
        if (!this.isDrawing || !this.currentShape) return;
        const pos = this.stage.getPointerPosition();
        if (!pos) return;

        switch (this.selectedTool) {
            case 'rectangle':
                (this.currentShape as Konva.Rect).width(pos.x - this.startPos.x);
                (this.currentShape as Konva.Rect).height(pos.y - this.startPos.y);
                break;
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(pos.x - this.startPos.x, 2) + Math.pow(pos.y - this.startPos.y, 2)
                );
                (this.currentShape as Konva.Circle).radius(radius);
                break;
            case 'arrow':
                (this.currentShape as Konva.Arrow).points([this.startPos.x, this.startPos.y, pos.x, pos.y]);
                break;
        }

        this.layer.batchDraw();
    }

    endDrawing() {
        this.isDrawing = false;
        this.currentShape = null;
        this.saveHistory(); // Çizim bittiğinde kaydet
    }

    handleSelect(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target === this.stage) {
            this.deselectShape();
            return;
        }

        if (this.selectedShape !== e.target) {
            this.selectedShape = e.target as Konva.Shape;
            this.transformer.nodes([this.selectedShape]);
            this.layer.draw();
        }
    }

    deselectShape() {
        this.selectedShape = null;
        this.transformer.nodes([]);
        this.layer.draw();
    }

    setTool(tool: ShapeType) {
        if (tool == 'no-canva') {
            this.layer.destroyChildren();
            this.layer.draw();
            this.historyJSON = [];
        } else {
            this.selectedTool = tool;
        }
    }

    private saveHistory() {
        const json = this.layer.toJSON();

        if (this.historyJSON.length > 0) {
            const last = this.historyJSON[this.historyJSON.length - 1];
            if (last === json) return;
        }

        this.historyJSON.push(json);
        console.log('History snapshot count:', this.historyJSON.length);
    }

    undo() {
        if (this.historyJSON.length <= 1) {
            this.historyJSON = [];
            this.layer.destroyChildren();
            this.layer.draw();
            return;
        }

        this.historyJSON.pop();
        const lastJSON = this.historyJSON[this.historyJSON.length - 1];

        this.layer.destroyChildren();
        const newLayer = Konva.Node.create(lastJSON, this.stage);
        this.stage.add(newLayer);
        this.layer = newLayer;
        this.layer.draw();
    }
}
