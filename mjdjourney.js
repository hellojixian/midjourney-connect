#!/usr/bin/env node
const axios = require('axios');
const { performance } = require('perf_hooks');

require('dotenv').config();
const token = process.env.TNL_TOKEN

const imagine = async (prompt, aspect) => {
  try {
    const data = JSON.stringify({
      msg: `${prompt} --aspect ${aspect} --quality 1`,
      ref: '',
      webhookOverride: ''
    });

    const config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/imagine',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios(config);
    return response.data
  } catch (error) {
    console.log(error);
  }
};


const getMessage = async(messageId) => {
  try {
    const config = {
      method: 'get',
      url: `https://api.thenextleg.io/v2/message/${messageId}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };

    const response = await axios(config);
    return response.data
  } catch (error) {
    console.log(error);
  }
}

const upscale = async (buttonMessageId, id) => {
  try {
    const data = JSON.stringify({
      button: `U${id}`,
      buttonMessageId: buttonMessageId,
      ref: '',
      webhookOverride: ''
    });

    const config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/button',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios(config);
    return response.data
  } catch (error) {
    console.log(error);
  }
}

const generate = async (prompt, aspect='2:3') => {
  result = await imagine(prompt, aspect);
  if (!result['success']) return;

  // wait for result
  let progress = 0;
  while(progress < 100) {
    // wait for one second
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { messageId } = result;
    message = await getMessage(messageId);
    if (message) {
      progress = message.progress;
      process.stdout.write(`\rGenerating progress: ${progress}% `);
    }
  }
  const {buttonMessageId} = message.response;
  process.stdout.write("\n");

  // upscale v1
  result = await upscale(buttonMessageId, 1);
  // wait for result
  progress = 0;
  while(progress < 100) {
    // wait for one second
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { messageId } = result;
    message = await getMessage(messageId);
    if (message) {
      progress = message.progress;
      process.stdout.write(`\rUpscaling progress: ${progress}% `);
    }
  }
  process.stdout.write("\n");
  const {imageUrl} = message.response;
  return imageUrl;
}


const default_prompt = 'a beautiful girl with blue eyes, by disney';
const aspect = '3:2';
//main logic
(async () => {
  const args = process.argv.slice(2);
  const prompt = args.join(' ') || default_prompt;
  console.log(`prompt: ${prompt}`);
  const start = performance.now();
  const imageUrl = await generate(prompt, aspect)
  const end = performance.now();
  const duration = end - start;
  //print result
  console.log(`myFunction took ${(duration/1000).toFixed(1)} seconds to run.`);
  console.log(`imageUrl: ${imageUrl}`);

  //open image in browser
  const { spawn } = require('child_process');
  const open_args = ['--new-window',imageUrl];
  spawn('google-chrome', open_args);
})();
