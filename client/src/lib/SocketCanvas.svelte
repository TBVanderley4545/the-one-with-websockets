<canvas
  on:mousedown={canvasMouseDown}
  on:mouseup={canvasMouseUp}
  on:mousemove={canvasMouseMove}
  bind:this={canvas}
  height="200"
  width="400"
/>

<script lang="ts">
  import type { Socket } from 'socket.io-client';
  import { onMount } from 'svelte';
  import type { Point } from './types/point';

  export let socketClient: Socket;

  let canvas: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D;
  let drawing = false;

  onMount(() => {
    canvasContext = canvas.getContext('2d');
    canvasContext.lineCap = 'round';
    canvasContext.lineWidth = 5;
  });

  socketClient.on('canvasUpdated', (data) => {
    canvasContext.moveTo(data.startPoint.x, data.startPoint.y);
    canvasContext.lineTo(data.endPoint.x, data.endPoint.y);
    canvasContext.stroke();
  });

  const getCanvasPoint = (event: MouseEvent, target: HTMLCanvasElement): Point => {
    const { clientX: screenX, clientY: screenY } = event;
    const { x: canvasX, y: canvasY } = target.getBoundingClientRect();

    return {
      x: screenX - canvasX,
      y: screenY - canvasY,
    };
  };

  const setTargetXY = (target: HTMLElement, point: Point) => {
    target.dataset['startingX'] = `${point.x}`;
    target.dataset['startingY'] = `${point.y}`;
  };

  const canvasMouseDown = (event: MouseEvent) => {
    const target = <HTMLCanvasElement>event.target;

    const startPoint = getCanvasPoint(event, target);

    setTargetXY(target, startPoint);

    drawing = true;
  };

  const canvasMouseUp = () => {
    drawing = false;
  };

  const canvasMouseMove = (event: MouseEvent) => {
    if (drawing === true) {
      const target = <HTMLCanvasElement>event.target;

      const startPoint: Point = {
        x: parseFloat(target.dataset['startingX']),
        y: parseFloat(target.dataset['startingY']),
      };
      const endPoint = getCanvasPoint(event, target);

      setTargetXY(target, endPoint);

      socketClient.emit('updateCanvas', {
        startPoint,
        endPoint,
      });
    }
  };
</script>

<style lang="scss">
  canvas {
    border: 2px solid rgba(255, 62, 0, 0.2);
  }
</style>
