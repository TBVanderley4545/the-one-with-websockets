<div>
  <h2>Connected to Web Socket: {socketConnected ? '🟢' : '🔴'}</h2>
  <p>Taking data from our websocket server.</p>
  <button on:click={clickTheButton}>Click Me to update count on the server!</button>
  <h3>Value from the server: {val}</h3>

  <div>
    <h3>This works on inputs too.</h3>

    <input bind:value={message} on:input={handleInput} />
  </div>
</div>

<SocketCanvas {socketClient} />
<hr />

<script lang="ts">
  import axios from 'axios';
  import { io } from 'socket.io-client';
  import SocketCanvas from './SocketCanvas.svelte';

  const endpoint = 'localhost:3001';

  const httpClient = axios.create({
    baseURL: `http://${endpoint}`,
  });

  const socketClient = io(`ws://${endpoint}`);

  let val = 0;
  let socketConnected = false;
  let message = '';

  socketClient.on('connect', () => {
    socketConnected = socketClient.connected;
  });

  socketClient.on('disconnect', () => {
    socketConnected = socketClient.connected;
  });

  socketClient.on('progress', (data) => {
    val = data;
  });

  socketClient.on('messageChanged', (data) => {
    message = data;
  });

  const clickTheButton = () => {
    httpClient.request({
      url: 'test',
      method: 'POST',
      data: {
        newValue: val + 1,
      },
    });
  };

  const handleInput = () => {
    socketClient.emit('updateMessage', message);
  };
</script>

<style lang="scss">
  div {
    padding: 2em 0;
  }

  button {
    background-color: rgba(255, 62, 0, 0.1);
    border: 2px solid rgba(255, 62, 0, 0);
    border-radius: 2em;
    color: #ff3e00;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-variant-numeric: tabular-nums;
    outline: none;
    padding: 1em 2em;
    width: 400px;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
